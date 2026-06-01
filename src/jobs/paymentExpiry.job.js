const cron = require('node-cron');
const db = require('../config/db');
const logger = require('../config/logger');

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
        await client.query(
          `UPDATE booking b
           SET payment_status = 'failed',
               status = 'expired'
           WHERE b.booking_id = ANY($1::int[])
             AND b.status = 'pending'
             AND NOT EXISTS (
               SELECT 1
               FROM payment p
               WHERE p.booking_id = b.booking_id
                 AND p.status = 'paid'
                 AND p.deleted_at IS NULL
             )`,
          [bookingIds]
        );

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
