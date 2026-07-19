const db = require('../config/db');
const bookingStatusHistoryModel = require('../models/bookingStatusHistory.model');

const MANUAL_CONFIRMATION_EXPIRE_MINUTES = Number(
  process.env.MANUAL_CONFIRMATION_EXPIRE_MINUTES || 1440
);
const UNPAID_BOOKING_EXPIRE_MINUTES = Number(process.env.UNPAID_BOOKING_EXPIRE_MINUTES || 1440);
const EXPIRY_LOCK_ID = 847231;

const createHistory = (row, action, reason, client) => bookingStatusHistoryModel.create({
  booking_id: row.booking_id,
  action,
  from_status: row.from_status,
  to_status: row.to_status,
  from_payment_status: row.from_payment_status,
  to_payment_status: row.to_payment_status,
  reason,
}, client);

const sweepExpiredBookings = async () => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const lock = await client.query(
      'SELECT pg_try_advisory_xact_lock($1) AS acquired',
      [EXPIRY_LOCK_ID]
    );
    if (!lock.rows[0].acquired) {
      await client.query('ROLLBACK');
      return {
        skipped: true,
        payments: 0,
        bookings: 0,
        manualBookings: 0,
        unpaidBookings: 0,
      };
    }

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

    let expiredBookings = { rows: [], rowCount: 0 };
    if (expiredPayments.rowCount > 0) {
      const bookingIds = expiredPayments.rows.map((row) => row.booking_id);
      expiredBookings = await client.query(
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
    }

    const expiredManualBookings = await client.query(
      `WITH candidates AS (
         SELECT booking_id, status, payment_status
         FROM booking
         WHERE status = 'waiting_manual_confirmation'
           AND payment_status <> 'paid'
           AND created_at < CURRENT_TIMESTAMP - ($1::int * INTERVAL '1 minute')
       )
       UPDATE booking b
       SET status = 'expired',
           payment_status = 'failed'
       FROM candidates c
       WHERE b.booking_id = c.booking_id
       RETURNING b.booking_id,
                 c.status AS from_status,
                 b.status AS to_status,
                 c.payment_status AS from_payment_status,
                 b.payment_status AS to_payment_status`,
      [MANUAL_CONFIRMATION_EXPIRE_MINUTES]
    );

    const expiredUnpaidBookings = await client.query(
      `WITH candidates AS (
         SELECT booking_id, status, payment_status
         FROM booking
         WHERE status = 'pending'
           AND payment_status IN ('unpaid', 'failed')
           AND created_at < CURRENT_TIMESTAMP - ($1::int * INTERVAL '1 minute')
           AND NOT EXISTS (
             SELECT 1
             FROM payment p
             WHERE p.booking_id = booking.booking_id
               AND p.status IN ('pending', 'paid')
               AND p.deleted_at IS NULL
           )
       )
       UPDATE booking b
       SET status = 'expired',
           payment_status = 'failed'
       FROM candidates c
       WHERE b.booking_id = c.booking_id
       RETURNING b.booking_id,
                 c.status AS from_status,
                 b.status AS to_status,
                 c.payment_status AS from_payment_status,
                 b.payment_status AS to_payment_status`,
      [UNPAID_BOOKING_EXPIRE_MINUTES]
    );

    for (const row of expiredBookings.rows) {
      await createHistory(
        row,
        'payment_auto_expired',
        'Pending payment expired automatically',
        client
      );
    }
    for (const row of expiredManualBookings.rows) {
      await createHistory(
        row,
        'manual_confirmation_auto_expired',
        'Manual payment confirmation window expired',
        client
      );
    }
    for (const row of expiredUnpaidBookings.rows) {
      await createHistory(
        row,
        'booking_auto_expired',
        'Unpaid booking expired automatically',
        client
      );
    }

    await client.query('COMMIT');
    return {
      skipped: false,
      payments: expiredPayments.rowCount,
      bookings: expiredBookings.rowCount,
      manualBookings: expiredManualBookings.rowCount,
      unpaidBookings: expiredUnpaidBookings.rowCount,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { sweepExpiredBookings };
