const cron = require('node-cron');
const db = require('../config/db');
const logger = require('../config/logger');

const startBookingExpiryJob = () => {
  cron.schedule('*/15 * * * *', async () => {
    try {
      const result = await db.query(
        `UPDATE booking
         SET status = 'canceled'
         WHERE status = 'pending'
           AND payment_status = 'pending'
           AND date_created < CURRENT_DATE
         RETURNING booking_id`
      );

      if (result.rowCount > 0) {
        logger.info('Expired pending bookings', { booking_ids: result.rows.map((row) => row.booking_id) });
      }
    } catch (error) {
      logger.error('Booking expiry job failed', { error: error.message });
    }
  });
};

module.exports = startBookingExpiryJob;

