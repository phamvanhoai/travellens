const bookingModel = require('../models/booking.model');
const bookingStatusHistoryModel = require('../models/bookingStatusHistory.model');
const paymentModel = require('../models/payment.model');
const refundRequestModel = require('../models/refundRequest.model');
const emailService = require('./email.service');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class RefundRequestService {
  list(query = {}) {
    return refundRequestModel.findAll(query);
  }

  async complete(id, payload = {}, staffId) {
    const client = await bookingModel.getClient();
    try {
      await client.query('BEGIN');

      const refundRequest = await refundRequestModel.findForUpdate(id, client);
      if (!refundRequest) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Refund request not found');
      }
      if (refundRequest.status !== 'pending') {
        throw new ApiError(httpStatus.BAD_REQUEST, `Refund request is already ${refundRequest.status}`);
      }
      if (refundRequest.payment_status !== 'paid') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Only paid payments can be marked as refunded');
      }

      await paymentModel.updateStatus(refundRequest.payment_id, 'refunded', {
        transaction_code: payload.transaction_code,
      }, client);
      await bookingModel.updatePaymentState(refundRequest.booking_id, 'refunded', undefined, client);
      const completed = await refundRequestModel.markCompleted(id, {
        staff_note: payload.staff_note,
        completed_by: staffId,
      }, client);
      await bookingStatusHistoryModel.create({
        booking_id: refundRequest.booking_id,
        action: 'manual_refund_completed',
        from_status: refundRequest.booking_status,
        to_status: refundRequest.booking_status,
        from_payment_status: refundRequest.booking_payment_status,
        to_payment_status: 'refunded',
        reason: payload.staff_note,
        changed_by: staffId,
        metadata: {
          refund_request_id: refundRequest.refund_request_id,
          payment_id: refundRequest.payment_id,
          refund_amount: refundRequest.refund_amount,
          transaction_code: payload.transaction_code || null,
        },
      }, client);

      await client.query('COMMIT');
      await emailService.sendBestEffort(async () => {
        const booking = await bookingModel.findNotificationContext(refundRequest.booking_id);
        if (!booking?.customer_email) return null;
        return emailService.sendRefundCompleted({
          to: booking.customer_email,
          name: booking.customer_name,
          booking,
          refundRequest: completed,
        });
      });
      return completed;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new RefundRequestService();
