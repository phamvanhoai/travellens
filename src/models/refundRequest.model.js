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
  rr.reviewed_by,
  rr.reviewed_at,
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
  if (query.search) {
    values.push(`%${query.search}%`);
    clauses.push(`(
      customer.name ILIKE $${values.length}
      OR customer.email ILIKE $${values.length}
      OR customer.phone ILIKE $${values.length}
      OR requester.name ILIKE $${values.length}
      OR requester.email ILIKE $${values.length}
      OR t.name ILIKE $${values.length}
      OR p.payment_code ILIKE $${values.length}
      OR p.transaction_code ILIKE $${values.length}
      OR rr.reason ILIKE $${values.length}
      OR rr.staff_note ILIKE $${values.length}
      OR CAST(rr.refund_request_id AS TEXT) ILIKE $${values.length}
      OR CAST(rr.booking_id AS TEXT) ILIKE $${values.length}
      OR CAST(rr.payment_id AS TEXT) ILIKE $${values.length}
    )`);
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

    const countResult = await executor.query(
      `SELECT COUNT(*)::int AS total
       FROM refund_request rr
       INNER JOIN booking b ON b.booking_id = rr.booking_id
       INNER JOIN users customer ON customer.user_id = b.user_id
       LEFT JOIN users requester ON requester.user_id = rr.requested_by
       INNER JOIN tour t ON t.tour_id = b.tour_id
       INNER JOIN payment p ON p.payment_id = rr.payment_id
       ${where.text}`,
      where.values
    );

    const values = [...where.values, limit, offset];

    const result = await executor.query(
      `SELECT ${refundRequestColumns},
              rr.refund_amount::float AS refund_amount,
              json_build_object(
                'user_id', customer.user_id,
                'name', customer.name,
                'email', customer.email,
                'phone', customer.phone,
                'avatar_url', customer.avatar_url
              ) AS customer,
              CASE
                WHEN requester.user_id IS NULL THEN NULL
                ELSE json_build_object(
                  'user_id', requester.user_id,
                  'name', requester.name,
                  'email', requester.email,
                  'phone', requester.phone,
                  'avatar_url', requester.avatar_url
                )
              END AS requester,
              json_build_object(
                'tour_id', t.tour_id,
                'name', t.name,
                'schedule', t.schedule,
                'thumbnail', t.thumbnail
              ) AS tour,
              json_build_object(
                'payment_id', p.payment_id,
                'payment_code', p.payment_code,
                'amount', p.amount::float,
                'payment_method', p.payment_method,
                'payment_provider', p.payment_provider,
                'status', p.status,
                'transaction_code', p.transaction_code,
                'paid_at', p.paid_at,
                'currency', p.currency
              ) AS payment,
              customer.name AS customer_name,
              t.name AS tour_name,
              p.payment_code
       FROM refund_request rr
       INNER JOIN booking b ON b.booking_id = rr.booking_id
       INNER JOIN users customer ON customer.user_id = b.user_id
       LEFT JOIN users requester ON requester.user_id = rr.requested_by
       INNER JOIN tour t ON t.tour_id = b.tour_id
       INNER JOIN payment p ON p.payment_id = rr.payment_id
       ${where.text}
       ORDER BY rr.refund_request_id DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    const total = countResult.rows[0].total;
    return {
      items: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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

  async markApproved(id, payload = {}, executor = db) {
    const result = await executor.query(
      `UPDATE refund_request
       SET status = 'approved',
           staff_note = COALESCE($2, staff_note),
           reviewed_by = $3,
           reviewed_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE refund_request_id = $1
       RETURNING *`,
      [id, payload.staff_note || null, payload.reviewed_by || null]
    );
    return result.rows[0] || null;
  },

  async markRejected(id, payload = {}, executor = db) {
    const result = await executor.query(
      `UPDATE refund_request
       SET status = 'rejected',
           staff_note = COALESCE($2, staff_note),
           reviewed_by = $3,
           reviewed_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE refund_request_id = $1
       RETURNING *`,
      [id, payload.staff_note || null, payload.reviewed_by || null]
    );
    return result.rows[0] || null;
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
