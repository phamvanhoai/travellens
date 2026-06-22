const db = require('../config/db');

const ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed', 'paid'];

module.exports = {
  async findAll(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
    const offset = (page - 1) * limit;
    const values = [];
    const clauses = [];

    for (const field of ['user_id', 'tour_id', 'status', 'payment_status']) {
      if (query[field] !== undefined) {
        values.push(query[field]);
        clauses.push(`${field} = $${values.length}`);
      }
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const sortOrder = query.sort === 'oldest' ? 'ASC' : 'DESC';
    values.push(limit, offset);

    const result = await db.query(
      `SELECT *
       FROM booking
       ${where}
       ORDER BY booking_id ${sortOrder}
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );
    return result.rows;
  },

  async findById(id, executor = db) {
    const result = await executor.query(
      'SELECT * FROM booking WHERE booking_id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async findOwnedById(id, userId, executor = db) {
    const result = await executor.query(
      'SELECT * FROM booking WHERE booking_id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0] || null;
  },

  async findForUpdate(id, userId, executor) {
    const values = [id];
    let ownerClause = '';
    if (userId) {
      values.push(userId);
      ownerClause = `AND user_id = $${values.length}`;
    }

    const result = await executor.query(
      `SELECT *
       FROM booking
       WHERE booking_id = $1
         ${ownerClause}
       FOR UPDATE`,
      values
    );
    return result.rows[0] || null;
  },

  async findOwnedForUpdate(id, userId, executor) {
    return this.findForUpdate(id, userId, executor);
  },

  async create(payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO booking
         (user_id, tour_id, coupon_id, original_amount, discount_amount,
          final_amount, status, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        payload.user_id,
        payload.tour_id,
        payload.coupon_id,
        payload.original_amount,
        payload.discount_amount,
        payload.final_amount,
        payload.status,
        payload.payment_status,
      ]
    );
    return result.rows[0];
  },

  async createDetails(bookingId, passengers, ticketPrice, executor = db) {
    const details = [];
    for (const passenger of passengers) {
      const result = await executor.query(
        `INSERT INTO booking_detail
           (booking_id, passenger_name, age_category, price, seat_number, special_request)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          bookingId,
          passenger.passenger_name,
          passenger.age_category,
          ticketPrice,
          passenger.seat_number,
          passenger.special_request,
        ]
      );
      details.push(result.rows[0]);
    }
    return details;
  },

  async countBookedSlots(tourId, executor = db) {
    const result = await executor.query(
      `SELECT COUNT(bd.booking_detail_id)::int AS booked_slots
       FROM booking b
       INNER JOIN booking_detail bd ON bd.booking_id = b.booking_id
       WHERE b.tour_id = $1
         AND b.status = ANY($2)`,
      [tourId, ACTIVE_BOOKING_STATUSES]
    );
    return Number(result.rows[0].booked_slots || 0);
  },

  async hasPaidPayment(bookingId, executor = db) {
    const result = await executor.query(
      `SELECT payment_id
       FROM payment
       WHERE booking_id = $1
         AND status = 'paid'
         AND deleted_at IS NULL
       LIMIT 1`,
      [bookingId]
    );
    return Boolean(result.rows[0]);
  },

  async expirePendingPayments(bookingId, executor = db) {
    const result = await executor.query(
      `UPDATE payment
       SET status = 'expired',
           updated_at = CURRENT_TIMESTAMP
       WHERE booking_id = $1
         AND status = 'pending'
         AND deleted_at IS NULL
       RETURNING payment_id`,
      [bookingId]
    );
    return result.rowCount;
  },

  async markCanceled(bookingId, paymentStatus, executor = db) {
    const result = await executor.query(
      `UPDATE booking
       SET status = 'canceled',
           payment_status = $2
       WHERE booking_id = $1
       RETURNING *`,
      [bookingId, paymentStatus]
    );
    return result.rows[0] || null;
  },

  async updatePaymentState(bookingId, paymentStatus, bookingStatus, executor = db) {
    const values = [bookingId, paymentStatus];
    const statusAssignment = bookingStatus === undefined
      ? ''
      : `, status = $${values.push(bookingStatus)}`;
    const result = await executor.query(
      `UPDATE booking
       SET payment_status = $2${statusAssignment}
       WHERE booking_id = $1
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async update(id, payload, executor = db) {
    const fields = ['status', 'payment_status']
      .filter((field) => payload[field] !== undefined);
    if (!fields.length) return this.findById(id, executor);

    const values = fields.map((field) => payload[field]);
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    values.push(id);
    const result = await executor.query(
      `UPDATE booking
       SET ${assignments.join(', ')}
       WHERE booking_id = $${values.length}
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async remove(id, executor = db) {
    const result = await executor.query(
      'DELETE FROM booking WHERE booking_id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  },

  getClient() {
    return db.getClient();
  },
};
