const db = require('../config/db');

const refundRequestColumns = `
  rr.refund_request_id,
  rr.booking_id,
  rr.payment_id,
  rr.requested_by,
  rr.reason,
  rr.refund_amount,
  rr.status,
  rr.staff_note,
  rr.completed_by,
  rr.completed_at,
  rr.created_at,
  rr.updated_at
`;

const buildListWhere = (query = {}) => {
  const values = [];
  const clauses = [];

  if (query.status) {
    values.push(query.status);
    clauses.push(`rr.status = $${values.length}`);
  }
  if (query.booking_id) {
    values.push(query.booking_id);
    clauses.push(`rr.booking_id = $${values.length}`);
  }
  if (query.payment_id) {
    values.push(query.payment_id);
    clauses.push(`rr.payment_id = $${values.length}`);
  }

  return {
    text: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    values,
  };
};

module.exports = {
  async findAll(query = {}, executor = db) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;
    const where = buildListWhere(query);
    const values = [...where.values, limit, offset];

    const result = await executor.query(
      `SELECT ${refundRequestColumns},
              u.name AS customer_name,
              t.name AS tour_name
       FROM refund_request rr
       INNER JOIN booking b ON b.booking_id = rr.booking_id
       INNER JOIN users u ON u.user_id = rr.requested_by
       INNER JOIN tour t ON t.tour_id = b.tour_id
       ${where.text}
       ORDER BY rr.refund_request_id DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );
    return result.rows;
  },

  async findPendingByBooking(bookingId, executor = db) {
    const result = await executor.query(
      `SELECT *
       FROM refund_request
       WHERE booking_id = $1
         AND status = 'pending'
       ORDER BY refund_request_id DESC
       LIMIT 1`,
      [bookingId]
    );
    return result.rows[0] || null;
  },

  async findForUpdate(id, executor) {
    const result = await executor.query(
      `SELECT rr.*,
              b.status AS booking_status,
              b.payment_status AS booking_payment_status,
              p.status AS payment_status
       FROM refund_request rr
       INNER JOIN booking b ON b.booking_id = rr.booking_id
       INNER JOIN payment p ON p.payment_id = rr.payment_id
       WHERE rr.refund_request_id = $1
       FOR UPDATE OF rr, b, p`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO refund_request
         (booking_id, payment_id, requested_by, reason, refund_amount, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [
        payload.booking_id,
        payload.payment_id,
        payload.requested_by,
        payload.reason || null,
        payload.refund_amount,
      ]
    );
    return result.rows[0];
  },

  async markCompleted(id, payload = {}, executor = db) {
    const result = await executor.query(
      `UPDATE refund_request
       SET status = 'completed',
           staff_note = COALESCE($2, staff_note),
           completed_by = $3,
           completed_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE refund_request_id = $1
       RETURNING *`,
      [id, payload.staff_note || null, payload.completed_by || null]
    );
    return result.rows[0] || null;
  },
};
