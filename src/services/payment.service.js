const crypto = require('crypto');
const paymentModel = require('../models/payment.model');
const bookingModel = require('../models/booking.model');
const bookingStatusHistoryModel = require('../models/bookingStatusHistory.model');
const couponService = require('./coupon.service');
const sepayService = require('./sepay.service');
const zaloBotService = require('./zaloBot.service');
const emailService = require('./email.service');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const PAYMENT_CODE_PREFIX = process.env.PAYMENT_CODE_PREFIX || 'TVL';
const EXPIRE_MINUTES = Number(process.env.PAYMENT_EXPIRE_MINUTES || 15);
const BANK_TRANSFER_MIN_AMOUNT = Number(process.env.BANK_TRANSFER_MIN_AMOUNT || 2000);

class PaymentService {
  withQrData(payment) {
    if (!payment) {
      return payment;
    }

    return {
      ...payment,
      bank_name: process.env.SEPAY_BANK_NAME || null,
      qr_url: sepayService.buildQrUrl(payment),
    };
  }

  list(query) {
    return paymentModel.findAll(query);
  }

  async get(id) {
    const payment = await paymentModel.findById(id);
    if (!payment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
    }
    return payment;
  }

  async createForCustomer(payload, userId) {
    const client = await bookingModel.getClient();
    try {
      await client.query('BEGIN');

      const booking = await bookingModel.findOwnedForUpdate(payload.booking_id, userId, client);

      if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
      }
      const amount = Number(booking.final_amount);
      if (amount === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Free bookings do not require bank payment');
      }
      if (booking.status === 'waiting_manual_confirmation') {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Booking is waiting for staff to confirm manual payment'
        );
      }
      if (booking.status !== 'pending') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Booking is not pending');
      }
      if (!['unpaid', 'pending', 'failed'].includes(booking.payment_status)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Booking is not unpaid');
      }

      if (amount < BANK_TRANSFER_MIN_AMOUNT) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Bank transfer amount must be at least ${BANK_TRANSFER_MIN_AMOUNT} VND`
        );
      }

      const activePayment = await paymentModel.findActivePendingByBooking(booking.booking_id, client);

      if (activePayment) {
        await client.query('COMMIT');
        return this.withQrData(activePayment);
      }

      await paymentModel.expirePendingByBooking(booking.booking_id, client);

      const paymentCode = await this.generateUniquePaymentCode(booking.booking_id, client);
      const payment = await paymentModel.create({
        booking_id: booking.booking_id,
        payment_code: paymentCode,
        amount: booking.final_amount,
        payment_method: 'bank_transfer',
        payment_provider: 'sepay',
        status: 'pending',
        bank_account: process.env.SEPAY_BANK_ACCOUNT || null,
        transfer_content: paymentCode,
        expire_minutes: EXPIRE_MINUTES,
        currency: 'VND',
      }, client);

      await bookingModel.updatePaymentState(booking.booking_id, 'unpaid', undefined, client);

      await client.query('COMMIT');
      return this.withQrData(payment);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getOwned(id, userId) {
    const payment = await paymentModel.findOwnedById(id, userId);
    if (!payment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
    }
    return this.withQrData(payment);
  }

  async getOwnedStatus(id, userId) {
    const payment = await this.getOwned(id, userId);
    return {
      payment_id: payment.payment_id,
      payment_status: payment.status,
      booking_status: payment.booking_status,
      booking_payment_status: payment.booking_payment_status,
    };
  }

  async confirmManualBooking(bookingId, payload = {}, staffId) {
    const client = await bookingModel.getClient();
    let clientReleased = false;
    let transactionCommitted = false;
    try {
      await client.query('BEGIN');
      const booking = await bookingModel.findForUpdate(bookingId, undefined, client);

      if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
      }
      if (booking.status !== 'waiting_manual_confirmation') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Booking is not waiting for manual confirmation');
      }
      if (booking.payment_status === 'paid') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Booking is already paid');
      }

      const paymentCode = await this.generateUniquePaymentCode(booking.booking_id, client);
      const pendingPayment = await paymentModel.create({
        booking_id: booking.booking_id,
        payment_code: paymentCode,
        amount: booking.final_amount,
        payment_method: 'manual',
        payment_provider: 'internal',
        status: 'pending',
        bank_account: null,
        transfer_content: payload.note || 'Confirmed manually by staff',
        expire_minutes: EXPIRE_MINUTES,
        currency: 'VND',
      }, client);
      const payment = await paymentModel.markPaid(pendingPayment.payment_id, {
        transaction_code: payload.transaction_code || `MANUAL-${paymentCode}`,
        sepay_transaction_id: null,
        bank_account: null,
        transfer_content: payload.note || 'Confirmed manually by staff',
        paid_at: new Date(),
      }, client);
      const confirmedBooking = await bookingModel.updatePaymentState(
        booking.booking_id,
        'paid',
        'confirmed',
        client
      );

      await bookingStatusHistoryModel.create({
        booking_id: booking.booking_id,
        action: 'manual_payment_confirmed',
        from_status: booking.status,
        to_status: confirmedBooking.status,
        from_payment_status: booking.payment_status,
        to_payment_status: confirmedBooking.payment_status,
        reason: payload.note || 'Payment confirmed manually by staff',
        changed_by: staffId || null,
        metadata: {
          payment_id: payment.payment_id,
          transaction_code: payment.transaction_code,
          source: 'staff',
        },
      }, client);

      if (booking.coupon_id) {
        await couponService.markUsed(booking.coupon_id, client);
      }

      await client.query('COMMIT');
      transactionCommitted = true;
      client.release();
      clientReleased = true;
      await zaloBotService.notifyPaymentPaid(payment);
      await emailService.sendBestEffort(() => emailService.sendPaymentPaid(payment));
      return { booking: confirmedBooking, payment };
    } catch (error) {
      if (!transactionCommitted) {
        await client.query('ROLLBACK');
      }
      throw error;
    } finally {
      if (!clientReleased) {
        client.release();
      }
    }
  }

  async refund(id, payload = {}) {
    const client = await bookingModel.getClient();
    try {
      await client.query('BEGIN');
      const currentPayment = await this.getPaymentForUpdate(id, client);
      if (!currentPayment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
      }
      if (currentPayment.status !== 'paid') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Only paid payments can be refunded');
      }

      const payment = await paymentModel.updateStatus(id, 'refunded', payload, client);
      await bookingModel.updatePaymentState(payment.booking_id, 'refunded', undefined, client);
      await this.logBookingHistory(currentPayment, {
        action: 'payment_refunded',
        toPaymentStatus: 'refunded',
        reason: payload.reason,
        metadata: {
          payment_id: payment.payment_id,
          transaction_code: payload.transaction_code || null,
        },
      }, client);
      await client.query('COMMIT');
      return payment;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateStatus(id, status) {
    const client = await bookingModel.getClient();
    let clientReleased = false;
    let transactionCommitted = false;
    try {
      await client.query('BEGIN');

      const currentPayment = await this.getPaymentForUpdate(id, client);
      if (!currentPayment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
      }

      if (currentPayment.status === status) {
        await client.query('COMMIT');
        return currentPayment;
      }

      this.validateStatusTransition(currentPayment, status);

      let payment;
      if (status === 'paid') {
        payment = await paymentModel.markPaid(id, {
          transaction_code: null,
          sepay_transaction_id: null,
          bank_account: null,
          transfer_content: currentPayment.transfer_content,
          paid_at: new Date(),
        }, client);
        await bookingModel.updatePaymentState(payment.booking_id, 'paid', 'confirmed', client);
        await this.logBookingHistory(currentPayment, {
          action: 'payment_paid',
          toStatus: 'confirmed',
          toPaymentStatus: 'paid',
          metadata: {
            payment_id: payment.payment_id,
            source: 'staff',
          },
        }, client);
        if (currentPayment.coupon_id) {
          await couponService.markUsed(currentPayment.coupon_id, client);
        }
      }
      if (status === 'refunded') {
        payment = await paymentModel.updateStatus(id, status, {}, client);
        await bookingModel.updatePaymentState(payment.booking_id, 'refunded', undefined, client);
        await this.logBookingHistory(currentPayment, {
          action: 'payment_refunded',
          toPaymentStatus: 'refunded',
          metadata: {
            payment_id: payment.payment_id,
            source: 'staff',
          },
        }, client);
      }
      if (status === 'failed') {
        payment = await paymentModel.markFailed(id, {}, client);
        await bookingModel.updatePaymentState(payment.booking_id, 'failed', undefined, client);
        await this.logBookingHistory(currentPayment, {
          action: 'payment_failed',
          toPaymentStatus: 'failed',
          metadata: {
            payment_id: payment.payment_id,
            source: 'staff',
          },
        }, client);
      }
      if (status === 'expired') {
        payment = await paymentModel.updateStatus(id, status, {}, client);
        await bookingModel.updatePaymentState(payment.booking_id, 'failed', undefined, client);
        await this.logBookingHistory(currentPayment, {
          action: 'payment_expired',
          toPaymentStatus: 'failed',
          metadata: {
            payment_id: payment.payment_id,
            source: 'staff',
          },
        }, client);
      }

      await client.query('COMMIT');
      transactionCommitted = true;
      client.release();
      clientReleased = true;
      if (status === 'paid') {
        await zaloBotService.notifyPaymentPaid(payment);
        await emailService.sendBestEffort(() => emailService.sendPaymentPaid(payment));
      }
      return payment;
    } catch (error) {
      if (!transactionCommitted) {
        await client.query('ROLLBACK');
      }
      throw error;
    } finally {
      if (!clientReleased) {
        client.release();
      }
    }
  }

  async getPaymentForUpdate(id, client) {
    return paymentModel.findForUpdate(id, client);
  }

  validateStatusTransition(payment, nextStatus) {
    if (nextStatus === 'pending') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Payment cannot be moved back to pending');
    }

    if (nextStatus === 'paid') {
      if (payment.status !== 'pending') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Only pending payments can be marked as paid');
      }
      if (payment.booking_status !== 'pending') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Only pending bookings can be marked as paid');
      }
      return;
    }

    if (nextStatus === 'refunded') {
      if (payment.status !== 'paid') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Only paid payments can be refunded');
      }
      return;
    }

    if (['failed', 'expired'].includes(nextStatus)) {
      if (payment.status !== 'pending') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Only pending payments can be failed or expired');
      }
      return;
    }

    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid payment status transition');
  }

  async generateUniquePaymentCode(bookingId, client) {
    const bookingPart = String(bookingId).padStart(6, '0');

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
      const code = `${PAYMENT_CODE_PREFIX}${bookingPart}${randomPart}`;
      const exists = await paymentModel.codeExists(code, client);
      if (!exists) {
        return code;
      }
    }

    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not generate unique payment code');
  }

  logBookingHistory(payment, payload, client) {
    return bookingStatusHistoryModel.create({
      booking_id: payment.booking_id,
      action: payload.action,
      from_status: payment.booking_status,
      to_status: payload.toStatus === undefined ? payment.booking_status : payload.toStatus,
      from_payment_status: payment.booking_payment_status,
      to_payment_status: payload.toPaymentStatus,
      reason: payload.reason,
      changed_by: payload.changedBy,
      metadata: payload.metadata,
    }, client);
  }
}

module.exports = new PaymentService();
