const cron = require('node-cron');
const db = require('../config/db');
const logger = require('../config/logger');
const bookingStatusHistoryModel = require('../models/bookingStatusHistory.model');

const startBookingExpiryJob = () => {
  cron.schedule('*/15 * * * *', async () => {
    try {
      const result = await db.query(
        `WITH candidates AS (
           SELECT booking_id, status, payment_status
           FROM booking
           WHERE status = 'pending'
             AND payment_status IN ('unpaid', 'pending')
             AND date_created < CURRENT_DATE
         )
         UPDATE booking b
         SET status = 'expired'
         FROM candidates c
         WHERE b.booking_id = c.booking_id
         RETURNING b.booking_id,
                   c.status AS from_status,
                   b.status AS to_status,
                   c.payment_status AS from_payment_status,
                   b.payment_status AS to_payment_status`
      );

      if (result.rowCount > 0) {
        for (const row of result.rows) {
          await bookingStatusHistoryModel.create({
            booking_id: row.booking_id,
            action: 'booking_auto_expired',
            from_status: row.from_status,
            to_status: row.to_status,
            from_payment_status: row.from_payment_status,
            to_payment_status: row.to_payment_status,
            reason: 'Pending booking expired automatically',
          });
        }
        logger.info('Expired pending bookings', { booking_ids: result.rows.map((row) => row.booking_id) });
      }
    } catch (error) {
      logger.error('Booking expiry job failed', { error: error.message });
    }
  });
};

module.exports = startBookingExpiryJob;
