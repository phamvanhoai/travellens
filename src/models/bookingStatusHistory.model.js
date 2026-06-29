const db = require('../config/db');

const historyColumns = `
  booking_status_history_id,
  booking_id,
  action,
  from_status,
  to_status,
  from_payment_status,
  to_payment_status,
  reason,
  changed_by,
  metadata,
  created_at
`;

module.exports = {
  async create(payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO booking_status_history
         (booking_id, action, from_status, to_status, from_payment_status,
          to_payment_status, reason, changed_by, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9::jsonb, '{}'::jsonb))
       RETURNING *`,
      [
        payload.booking_id,
        payload.action,
        payload.from_status || null,
        payload.to_status || null,
        payload.from_payment_status || null,
        payload.to_payment_status || null,
        payload.reason || null,
        payload.changed_by || null,
        payload.metadata ? JSON.stringify(payload.metadata) : null,
      ]
    );
    return result.rows[0];
  },

  async findByBooking(bookingId, executor = db) {
    const result = await executor.query(
      `SELECT ${historyColumns}
       FROM booking_status_history
       WHERE booking_id = $1
       ORDER BY booking_status_history_id ASC`,
      [bookingId]
    );
    return result.rows;
  },
};
