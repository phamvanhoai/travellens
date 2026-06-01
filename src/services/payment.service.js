const crypto = require('crypto');
const db = require('../config/db');
const paymentModel = require('../models/payment.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const PAYMENT_CODE_PREFIX = process.env.PAYMENT_CODE_PREFIX || 'TVL';
const EXPIRE_MINUTES = Number(process.env.PAYMENT_EXPIRE_MINUTES || 15);

class PaymentService {
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
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const bookingResult = await client.query(
        `SELECT *
         FROM booking
         WHERE booking_id = $1 AND user_id = $2
         FOR UPDATE`,
        [payload.booking_id, userId]
      );
      const booking = bookingResult.rows[0];

      if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
      }
      if (booking.status !== 'pending') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Booking is not pending');
      }
      if (!['unpaid', 'pending'].includes(booking.payment_status)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Booking is not unpaid');
      }

      const activePaymentResult = await client.query(
        `SELECT *
         FROM payment
         WHERE booking_id = $1
           AND status = 'pending'
           AND expired_at > CURRENT_TIMESTAMP
           AND deleted_at IS NULL
         ORDER BY payment_id DESC
         LIMIT 1`,
        [booking.booking_id]
      );

      if (activePaymentResult.rows[0]) {
        await client.query('COMMIT');
        return activePaymentResult.rows[0];
      }

      await client.query(
        `UPDATE payment
         SET status = 'expired',
             updated_at = CURRENT_TIMESTAMP
         WHERE booking_id = $1
           AND status = 'pending'
           AND deleted_at IS NULL`,
        [booking.booking_id]
      );

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

      await client.query(
        `UPDATE booking
         SET payment_status = 'unpaid'
         WHERE booking_id = $1`,
        [booking.booking_id]
      );

      await client.query('COMMIT');
      return payment;
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
    return payment;
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
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const payment = await paymentModel.updateStatus(id, 'refunded', payload, client);
      if (!payment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
      }
      await client.query(
        `UPDATE booking
         SET payment_status = 'refunded'
         WHERE booking_id = $1`,
        [payment.booking_id]
      );
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
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const payment = await paymentModel.updateStatus(id, status, {}, client);
      if (!payment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
      }

      if (status === 'paid') {
        await client.query(
          `UPDATE booking
           SET payment_status = 'paid',
               status = 'confirmed'
           WHERE booking_id = $1`,
          [payment.booking_id]
        );
      }
      if (status === 'refunded') {
        await client.query(
          `UPDATE booking
           SET payment_status = 'refunded'
           WHERE booking_id = $1`,
          [payment.booking_id]
        );
      }
      if (status === 'failed') {
        await client.query(
          `UPDATE booking
           SET payment_status = 'failed'
           WHERE booking_id = $1`,
          [payment.booking_id]
        );
      }

      await client.query('COMMIT');
      return payment;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async generateUniquePaymentCode(bookingId, client) {
    const bookingPart = String(bookingId).padStart(6, '0');

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
      const code = `${PAYMENT_CODE_PREFIX}${bookingPart}${randomPart}`;
      const exists = await client.query('SELECT 1 FROM payment WHERE payment_code = $1', [code]);
      if (!exists.rowCount) {
        return code;
      }
    }

    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not generate unique payment code');
  }
}

module.exports = new PaymentService();
