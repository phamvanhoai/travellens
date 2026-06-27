const crypto = require('crypto');
const paymentModel = require('../models/payment.model');
const bookingModel = require('../models/booking.model');
const couponService = require('./coupon.service');
const sepayService = require('./sepay.service');
const zaloBotService = require('./zaloBot.service');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const PAYMENT_CODE_PREFIX = process.env.PAYMENT_CODE_PREFIX || 'TVL';
const EXPIRE_MINUTES = Number(process.env.PAYMENT_EXPIRE_MINUTES || 15);

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
      if (booking.status !== 'pending') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Booking is not pending');
      }
      if (!['unpaid', 'pending', 'failed'].includes(booking.payment_status)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Booking is not unpaid');
      }

      const activePayment = await paymentModel.findActivePendingByBooking(booking.booking_id, client);

      if (activePayment) {
        await client.query('COMMIT');
        return this.withQrData(activePayment);
      }

      await paymentModel.expirePendingByBooking(booking.booking_id, client);

      const paymentCode = await this.generateUniquePaymentCode(booking.booking_id, client);
      const expiredAt = new Date(Date.now() + EXPIRE_MINUTES * 60 * 1000);
      const payment = await paymentModel.create({
        booking_id: booking.booking_id,
        payment_code: paymentCode,
        amount: booking.final_amount,
        payment_method: 'bank_transfer',
        payment_provider: 'sepay',
        status: 'pending',
        bank_account: process.env.SEPAY_BANK_ACCOUNT || null,
        transfer_content: paymentCode,
        expired_at: expiredAt,
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
        if (currentPayment.coupon_id) {
          await couponService.markUsed(currentPayment.coupon_id, client);
        }
      }
      if (status === 'refunded') {
        payment = await paymentModel.updateStatus(id, status, {}, client);
        await bookingModel.updatePaymentState(payment.booking_id, 'refunded', undefined, client);
      }
      if (status === 'failed') {
        payment = await paymentModel.markFailed(id, {}, client);
        await bookingModel.updatePaymentState(payment.booking_id, 'failed', undefined, client);
      }
      if (status === 'expired') {
        payment = await paymentModel.updateStatus(id, status, {}, client);
        await bookingModel.updatePaymentState(payment.booking_id, 'failed', undefined, client);
      }

      await client.query('COMMIT');
      if (status === 'paid') {
        await zaloBotService.notifyPaymentPaid(payment);
      }
      return payment;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
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
}

module.exports = new PaymentService();
