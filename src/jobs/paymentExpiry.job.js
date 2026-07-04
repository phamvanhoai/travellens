const cron = require('node-cron');
const db = require('../config/db');
const logger = require('../config/logger');
const bookingStatusHistoryModel = require('../models/bookingStatusHistory.model');

const startPaymentExpiryJob = () => {
  cron.schedule('*/1 * * * *', async () => {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const expiredPayments = await client.query(
        `UPDATE payment
         SET status = 'expired',
             updated_at = CURRENT_TIMESTAMP
         WHERE status = 'pending'
           AND expired_at IS NOT NULL
           AND expired_at < CURRENT_TIMESTAMP
           AND deleted_at IS NULL
         RETURNING payment_id, booking_id`
      );

      if (expiredPayments.rowCount > 0) {
        const bookingIds = expiredPayments.rows.map((row) => row.booking_id);
        const expiredBookings = await client.query(
          `WITH candidates AS (
             SELECT b.booking_id, b.status, b.payment_status
             FROM booking b
             WHERE b.booking_id = ANY($1::int[])
               AND b.status = 'pending'
               AND NOT EXISTS (
                 SELECT 1
                 FROM payment p
                 WHERE p.booking_id = b.booking_id
                   AND p.status = 'paid'
                   AND p.deleted_at IS NULL
               )
           )
           UPDATE booking b
           SET payment_status = 'failed',
               status = 'expired'
           FROM candidates c
           WHERE b.booking_id = c.booking_id
           RETURNING b.booking_id,
                     c.status AS from_status,
                     b.status AS to_status,
                     c.payment_status AS from_payment_status,
                     b.payment_status AS to_payment_status`,
          [bookingIds]
        );

        for (const row of expiredBookings.rows) {
          await bookingStatusHistoryModel.create({
            booking_id: row.booking_id,
            action: 'payment_auto_expired',
            from_status: row.from_status,
            to_status: row.to_status,
            from_payment_status: row.from_payment_status,
            to_payment_status: row.to_payment_status,
            reason: 'Pending payment expired automatically',
          }, client);
        }

        logger.info('Expired pending payments', {
          payment_ids: expiredPayments.rows.map((row) => row.payment_id),
        });
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Payment expiry job failed', { error: error.message });
    } finally {
      client.release();
    }
  });
};

module.exports = startPaymentExpiryJob;
