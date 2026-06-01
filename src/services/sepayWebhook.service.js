const db = require('../config/db');
const paymentModel = require('../models/payment.model');
const sepayWebhookLogModel = require('../models/sepayWebhookLog.model');
const couponService = require('./coupon.service');
const sepayService = require('./sepay.service');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class SepayWebhookService {
  async process(payload, headers = {}) {
    if (!sepayService.verifyApiKey(headers)) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid SePay webhook API key');
    }

    const paymentCode = sepayService.extractPaymentCode(payload);
    const sepayTransactionId = String(payload.id || payload.transactionId || '').trim();
    const transferType = String(payload.transferType || '').toLowerCase();
    const transferAmount = Number(payload.transferAmount || 0);

    if (!sepayTransactionId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'SePay transaction id is required');
    }

    const logPayload = {
      sepay_transaction_id: sepayTransactionId,
      payment_code: paymentCode,
      transfer_amount: transferAmount,
      transfer_type: transferType,
      raw_payload: payload,
    };

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const log = await sepayWebhookLogModel.create(logPayload, client);
      if (!log) {
        await client.query('COMMIT');
        return { duplicate: true, message: 'Webhook already processed' };
      }

      if (transferType !== 'in') {
        await sepayWebhookLogModel.updateStatus(log.sepay_webhook_log_id, 'ignored', 'Only money-in transactions are processed', null, client);
        await client.query('COMMIT');
        return { ignored: true, message: 'Only money-in transactions are processed' };
      }

      if (!paymentCode || !paymentCode.startsWith(process.env.PAYMENT_CODE_PREFIX || 'TVL')) {
        await sepayWebhookLogModel.updateStatus(log.sepay_webhook_log_id, 'ignored', 'Payment code not found', null, client);
        await client.query('COMMIT');
        return { ignored: true, message: 'Payment code not found' };
      }

      const payment = await paymentModel.findPendingByCodeForUpdate(paymentCode, client);
      if (!payment) {
        await sepayWebhookLogModel.updateStatus(log.sepay_webhook_log_id, 'ignored', 'Payment not found', null, client);
        await client.query('COMMIT');
        return { ignored: true, message: 'Payment not found' };
      }

      if (payment.status === 'paid') {
        await sepayWebhookLogModel.updateStatus(log.sepay_webhook_log_id, 'duplicate_paid', 'Payment already paid', payment.payment_id, client);
        await client.query('COMMIT');
        return { duplicate: true, message: 'Payment already paid' };
      }

      if (payment.status !== 'pending') {
        await sepayWebhookLogModel.updateStatus(log.sepay_webhook_log_id, 'ignored', `Payment status is ${payment.status}`, payment.payment_id, client);
        await client.query('COMMIT');
        return { ignored: true, message: `Payment status is ${payment.status}` };
      }

      if (Number(payment.amount) !== transferAmount) {
        await paymentModel.markFailed(payment.payment_id, {
          transaction_code: payload.referenceCode || null,
          sepay_transaction_id: sepayTransactionId,
          transfer_content: payload.content || paymentCode,
        }, client);
        await client.query(
          `UPDATE booking
           SET payment_status = 'failed'
           WHERE booking_id = $1`,
          [payment.booking_id]
        );
        await sepayWebhookLogModel.updateStatus(log.sepay_webhook_log_id, 'amount_mismatch', 'Transfer amount does not match payment amount', payment.payment_id, client);
        await client.query('COMMIT');
        return { failed: true, message: 'Transfer amount does not match payment amount' };
      }

      const paidAt = payload.transactionDate ? new Date(payload.transactionDate) : new Date();
      const paidPayment = await paymentModel.markPaid(payment.payment_id, {
        transaction_code: payload.referenceCode || null,
        sepay_transaction_id: sepayTransactionId,
        bank_account: payload.accountNumber || null,
        transfer_content: payload.content || paymentCode,
        paid_at: paidAt,
      }, client);

      await client.query(
        `UPDATE booking
         SET payment_status = 'paid',
             status = 'confirmed'
         WHERE booking_id = $1`,
        [payment.booking_id]
      );

      if (payment.coupon_id) {
        await couponService.markUsed(payment.coupon_id, client);
      }

      await sepayWebhookLogModel.updateStatus(log.sepay_webhook_log_id, 'processed', 'Payment marked as paid', payment.payment_id, client);
      await client.query('COMMIT');

      return {
        payment_id: paidPayment.payment_id,
        payment_code: paidPayment.payment_code,
        status: paidPayment.status,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new SepayWebhookService();
