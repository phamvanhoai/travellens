const BaseService = require('./base.service');
const bookingModel = require('../models/booking.model');
const bookingStatusHistoryModel = require('../models/bookingStatusHistory.model');
const paymentModel = require('../models/payment.model');
const refundRequestModel = require('../models/refundRequest.model');
const tourModel = require('../models/tour.model');
const userModel = require('../models/user.model');
const couponService = require('./coupon.service');
const emailService = require('./email.service');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const CUSTOMER_CANCEL_DEADLINE_HOURS = 24;

class BookingService extends BaseService {
  list(query = {}) {
    return bookingModel.findAll(query);
  }

  async create(payload) {
    const client = await bookingModel.getClient();
    try {
      await client.query('BEGIN');

      const passengers = payload.passengers || payload.details || [];
      if (!payload.user_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User is required for booking');
      }
      if (!passengers.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'At least one passenger is required');
      }

      const tour = await this.ensureBookableTourExists(payload.tour_id, client, { lock: true });
      await this.ensureCustomerExists(payload.user_id, client);
      await this.ensureTourHasCapacity(tour, passengers.length, client, payload.departure_at);

      const ticketPrice = Number(tour.price);
      const originalAmount = ticketPrice * passengers.length;
      let couponSnapshot = {
        coupon_id: null,
        discount_amount: 0,
        final_amount: originalAmount,
      };

      if (payload.coupon_code) {
        couponSnapshot = await couponService.validateCoupon({
          code: payload.coupon_code,
          booking_amount: originalAmount,
        });
      } else if (payload.coupon_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Use coupon_code to apply coupon');
      }

      const booking = await bookingModel.create({
        user_id: payload.user_id,
        tour_id: payload.tour_id,
        coupon_id: couponSnapshot.coupon_id,
        departure_at: payload.departure_at,
        original_amount: originalAmount,
        discount_amount: couponSnapshot.discount_amount,
        final_amount: couponSnapshot.final_amount,
        status: 'pending',
        payment_status: 'unpaid',
      }, client);
      const details = await bookingModel.createDetails(
        booking.booking_id,
        passengers,
        ticketPrice,
        client
      );
      await this.logHistory({
        booking,
        action: 'booking_created',
        fromStatus: null,
        toStatus: booking.status,
        fromPaymentStatus: null,
        toPaymentStatus: booking.payment_status,
        changedBy: payload.user_id,
        metadata: {
          passenger_count: passengers.length,
          final_amount: booking.final_amount,
          departure_at: booking.departure_at,
        },
      }, client);

      await client.query('COMMIT');
      return { ...booking, details };
    } catch (error) {
      await client.query('ROLLBACK');
      if (error.code === '23503' && error.constraint === 'fk_booking_tour') {
        throw new ApiError(httpStatus.NOT_FOUND, 'Tour not found');
      }
      throw error;
    } finally {
      client.release();
    }
  }

  listForUser(userId, query = {}) {
    return this.list({ ...query, user_id: userId });
  }

  async ensureBookableTourExists(tourId, client, options = {}) {
    const tour = options.lock
      ? await tourModel.findForUpdate(tourId, client)
      : await tourModel.findRawById(tourId, client);
    if (!tour) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Tour not found');
    }
    if (tour.status !== 'active') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tour is not available for booking');
    }
    return tour;
  }

  async ensureCustomerExists(userId, client) {
    const customer = await userModel.findActiveCustomerById(userId, client);
    if (!customer) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Customer does not exist or is not active');
    }
  }

  ensureDepartureAtIsValid(departureAt) {
    if (!departureAt) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Departure time is required');
    }

    const departureTime = new Date(departureAt).getTime();
    if (Number.isNaN(departureTime)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Departure time is invalid');
    }
    if (departureTime <= Date.now()) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Departure time must be in the future');
    }
  }

  async ensureTourHasCapacity(tour, requestedSlots, client, departureAt) {
    const bookedSlots = await bookingModel.countBookedSlots(tour.tour_id, departureAt, client);
    const availableSlots = Number(tour.capacity || 0) - bookedSlots;
    if (requestedSlots > availableSlots) {
      throw new ApiError(httpStatus.CONFLICT, 'Not enough available slots for this tour', {
        capacity: Number(tour.capacity || 0),
        booked_slots: bookedSlots,
        available_slots: availableSlots,
        requested_slots: requestedSlots,
        departure_at: departureAt,
      });
    }
  }

  async getForUser(id, userId) {
    const booking = await bookingModel.findOwnedById(id, userId);
    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }
    return booking;
  }

  createForUser(payload, userId) {
    return this.create({ ...payload, user_id: userId });
  }

  async updateForUser(id, userId, payload) {
    await this.getForUser(id, userId);
    const booking = await bookingModel.update(id, payload);
    if (!booking) throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    return booking;
  }

  async removeForUser(id, userId) {
    await this.getForUser(id, userId);
    const booking = await bookingModel.remove(id);
    if (!booking) throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    return booking;
  }

  async cancel(id, options = {}) {
    const client = await bookingModel.getClient();
    try {
      await client.query('BEGIN');
      const booking = await bookingModel.findForUpdate(id, options.userId, client);

      if (!booking) throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
      if (['canceled', 'expired'].includes(booking.status)) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Booking is already ${booking.status}`);
      }

      if (options.enforceCancelDeadline) {
        this.ensureCancelableBeforeDeparture(booking.departure_at);
      }

      const hasPaidPayment = await bookingModel.hasPaidPayment(id, client);
      const isPaidBooking = booking.payment_status === 'paid' || hasPaidPayment;
      if (isPaidBooking && !options.refundPaidBooking) {
        throw new ApiError(httpStatus.CONFLICT, 'Paid booking requires staff refund before cancellation');
      }

      if (isPaidBooking) {
        const paidPayment = await paymentModel.findPaidByBookingForUpdate(id, client);
        if (!paidPayment) {
          throw new ApiError(httpStatus.CONFLICT, 'Paid booking requires staff refund before cancellation');
        }

        const existingRefundRequest = await refundRequestModel.findPendingByBooking(id, client);
        const refundRequest = existingRefundRequest || await refundRequestModel.create({
          booking_id: booking.booking_id,
          payment_id: paidPayment.payment_id,
          requested_by: options.userId || options.canceledBy,
          reason: options.reason,
          refund_amount: paidPayment.amount,
        }, client);

        const canceled = await bookingModel.markCanceled(id, 'paid', {
          canceledBy: options.canceledBy || options.userId || null,
          reason: options.reason,
        }, client);
        await this.logHistory({
          booking,
          action: 'booking_canceled_refund_pending',
          toStatus: canceled.status,
          toPaymentStatus: canceled.payment_status,
          changedBy: options.canceledBy || options.userId || null,
          reason: options.reason,
          metadata: {
            refund_amount: Number(paidPayment.amount || 0),
            refund_percent: 100,
            refund_request_id: refundRequest.refund_request_id,
            payment_id: paidPayment.payment_id,
          },
        }, client);

        await client.query('COMMIT');
        await emailService.sendBestEffort(() => this.sendCancelNotifications({
          bookingId: id,
          refundRequest,
        }));
        return {
          ...canceled,
          refund_amount: Number(paidPayment.amount || 0),
          refund_percent: 100,
          refund_status: refundRequest.status,
          refund_request_id: refundRequest.refund_request_id,
          refund_payment_id: paidPayment.payment_id,
        };
      }

      const expiredPayments = await bookingModel.expirePendingPayments(id, client);
      const nextPaymentStatus = expiredPayments > 0 ? 'failed' : booking.payment_status;
      const canceled = await bookingModel.markCanceled(id, nextPaymentStatus, {
        canceledBy: options.canceledBy || options.userId || null,
        reason: options.reason,
      }, client);
      await this.logHistory({
        booking,
        action: 'booking_canceled',
        toStatus: canceled.status,
        toPaymentStatus: canceled.payment_status,
        changedBy: options.canceledBy || options.userId || null,
        reason: options.reason,
        metadata: {
          expired_pending_payments: expiredPayments,
        },
      }, client);

      await client.query('COMMIT');
      await emailService.sendBestEffort(() => this.sendCancelNotifications({ bookingId: id }));
      return canceled;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  cancelForUser(id, userId, payload = {}) {
    return this.cancel(id, {
      userId,
      canceledBy: userId,
      reason: payload.reason,
      enforceCancelDeadline: true,
      refundPaidBooking: true,
    });
  }

  ensureCancelableBeforeDeparture(departureAt) {
    if (!departureAt) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Booking departure time is not configured');
    }

    const departureTime = new Date(departureAt).getTime();
    const deadlineAt = departureTime - CUSTOMER_CANCEL_DEADLINE_HOURS * 60 * 60 * 1000;
    if (Date.now() > deadlineAt) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Booking can only be canceled at least ${CUSTOMER_CANCEL_DEADLINE_HOURS} hours before departure time`
      );
    }
  }

  async getHistory(id) {
    const booking = await bookingModel.findById(id);
    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }
    return bookingStatusHistoryModel.findByBooking(id);
  }

  logHistory(payload, client) {
    return bookingStatusHistoryModel.create({
      booking_id: payload.booking.booking_id,
      action: payload.action,
      from_status: payload.fromStatus === undefined ? payload.booking.status : payload.fromStatus,
      to_status: payload.toStatus,
      from_payment_status: payload.fromPaymentStatus === undefined
        ? payload.booking.payment_status
        : payload.fromPaymentStatus,
      to_payment_status: payload.toPaymentStatus,
      reason: payload.reason,
      changed_by: payload.changedBy,
      metadata: payload.metadata,
    }, client);
  }

  async sendCancelNotifications({ bookingId, refundRequest }) {
    const booking = await bookingModel.findNotificationContext(bookingId);
    if (!booking || !booking.customer_email) {
      return;
    }

    await emailService.sendBestEffort(() => emailService.sendBookingCanceled({
      to: booking.customer_email,
      name: booking.customer_name,
      booking,
      refundRequest,
    }));

    if (refundRequest) {
      await emailService.sendBestEffort(() => emailService.sendRefundRequestCreated({
        booking,
        refundRequest,
      }));
    }
  }
}

module.exports = new BookingService(bookingModel);
