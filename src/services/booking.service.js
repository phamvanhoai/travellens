const BaseService = require('./base.service');
const bookingModel = require('../models/booking.model');
const tourModel = require('../models/tour.model');
const userModel = require('../models/user.model');
const couponService = require('./coupon.service');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

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
      await this.ensureTourHasCapacity(tour, passengers.length, client);

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

  async ensureTourHasCapacity(tour, requestedSlots, client) {
    const bookedSlots = await bookingModel.countBookedSlots(tour.tour_id, client);
    const availableSlots = Number(tour.capacity || 0) - bookedSlots;
    if (requestedSlots > availableSlots) {
      throw new ApiError(httpStatus.CONFLICT, 'Not enough available slots for this tour', {
        capacity: Number(tour.capacity || 0),
        booked_slots: bookedSlots,
        available_slots: availableSlots,
        requested_slots: requestedSlots,
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

      const hasPaidPayment = await bookingModel.hasPaidPayment(id, client);
      if (booking.payment_status === 'paid' || hasPaidPayment) {
        throw new ApiError(httpStatus.CONFLICT, 'Paid booking requires staff refund before cancellation');
      }

      const expiredPayments = await bookingModel.expirePendingPayments(id, client);
      const nextPaymentStatus = expiredPayments > 0 ? 'failed' : booking.payment_status;
      const canceled = await bookingModel.markCanceled(id, nextPaymentStatus, client);

      await client.query('COMMIT');
      return canceled;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  cancelForUser(id, userId) {
    return this.cancel(id, { userId });
  }
}

module.exports = new BookingService(bookingModel);
