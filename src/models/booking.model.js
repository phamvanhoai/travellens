const db = require('../config/db');

const ACTIVE_BOOKING_STATUSES = [
  'pending',
  'waiting_manual_confirmation',
  'confirmed',
  'cancel_pending',
  'paid',
];

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

  async findAllForStaffView(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;
    const values = [];
    const clauses = [];

    if (query.user_id !== undefined) {
      values.push(query.user_id);
      clauses.push(`b.user_id = $${values.length}`);
    }

    if (query.tour_id !== undefined) {
      values.push(query.tour_id);
      clauses.push(`b.tour_id = $${values.length}`);
    }

    if (query.status !== undefined) {
      values.push(query.status);
      clauses.push(`b.status = $${values.length}`);
    }

    if (query.payment_status !== undefined) {
      values.push(query.payment_status);
      clauses.push(`b.payment_status = $${values.length}`);
    }

    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`(
        u.name ILIKE $${values.length}
        OR u.email ILIKE $${values.length}
        OR u.phone ILIKE $${values.length}
        OR t.name ILIKE $${values.length}
        OR CAST(b.booking_id AS TEXT) ILIKE $${values.length}
      )`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const sortColumns = {
      booking_id: 'b.booking_id',
      departure_at: 'b.departure_at',
      date_created: 'b.date_created',
      final_amount: 'b.final_amount',
      status: 'b.status',
      payment_status: 'b.payment_status',
    };
    const sortBy = sortColumns[query.sortBy] || sortColumns.booking_id;
    const sortOrder = String(query.sortOrder || query.sort || 'DESC').toUpperCase() === 'ASC'
      || query.sort === 'oldest'
      ? 'ASC'
      : 'DESC';

    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM booking b
       INNER JOIN users u ON u.user_id = b.user_id
       INNER JOIN tour t ON t.tour_id = b.tour_id
       ${where}`,
      values
    );

    const listValues = [...values, limit, offset];
    const result = await db.query(
      `SELECT
          b.*,
          b.original_amount::float AS original_amount,
          b.discount_amount::float AS discount_amount,
          b.final_amount::float AS final_amount,
          COUNT(bd.booking_detail_id)::int AS passenger_count,
          json_build_object(
            'user_id', u.user_id,
            'name', u.name,
            'email', u.email,
            'phone', u.phone,
            'avatar_url', u.avatar_url
          ) AS customer,
          json_build_object(
            'tour_id', t.tour_id,
            'name', t.name,
            'schedule', t.schedule,
            'start_at', t.start_at,
            'thumbnail', t.thumbnail,
            'price', t.price::float,
            'child_price', t.child_price::float,
            'capacity', t.capacity,
            'status', t.status
          ) AS tour,
          CASE
            WHEN latest_payment.payment_id IS NULL THEN NULL
            ELSE json_build_object(
              'payment_id', latest_payment.payment_id,
              'payment_code', latest_payment.payment_code,
              'amount', latest_payment.amount::float,
              'payment_method', latest_payment.payment_method,
              'payment_provider', latest_payment.payment_provider,
              'status', latest_payment.status,
              'transaction_code', latest_payment.transaction_code,
              'paid_at', latest_payment.paid_at,
              'expired_at', latest_payment.expired_at,
              'currency', latest_payment.currency
            )
          END AS latest_payment
       FROM booking b
       INNER JOIN users u ON u.user_id = b.user_id
       INNER JOIN tour t ON t.tour_id = b.tour_id
       LEFT JOIN booking_detail bd ON bd.booking_id = b.booking_id
       LEFT JOIN LATERAL (
          SELECT *
          FROM payment p
          WHERE p.booking_id = b.booking_id
            AND p.deleted_at IS NULL
          ORDER BY p.payment_id DESC
          LIMIT 1
       ) latest_payment ON TRUE
       ${where}
       GROUP BY b.booking_id, u.user_id, t.tour_id, latest_payment.payment_id,
         latest_payment.payment_code, latest_payment.amount, latest_payment.payment_method,
         latest_payment.payment_provider, latest_payment.status, latest_payment.transaction_code,
         latest_payment.paid_at, latest_payment.expired_at, latest_payment.currency
       ORDER BY ${sortBy} ${sortOrder}, b.booking_id DESC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues
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

  async findStaffViewById(id, executor = db) {
    const result = await executor.query(
      `SELECT
          b.*,
          b.original_amount::float AS original_amount,
          b.discount_amount::float AS discount_amount,
          b.final_amount::float AS final_amount,
          json_build_object(
            'user_id', u.user_id,
            'name', u.name,
            'email', u.email,
            'phone', u.phone,
            'avatar_url', u.avatar_url,
            'address', u.address
          ) AS customer,
          json_build_object(
            'tour_id', t.tour_id,
            'name', t.name,
            'description', t.description,
            'schedule', t.schedule,
            'start_at', t.start_at,
            'thumbnail', t.thumbnail,
            'price', t.price::float,
            'child_price', t.child_price::float,
            'capacity', t.capacity,
            'status', t.status
          ) AS tour,
          CASE
            WHEN latest_payment.payment_id IS NULL THEN NULL
            ELSE json_build_object(
              'payment_id', latest_payment.payment_id,
              'payment_code', latest_payment.payment_code,
              'amount', latest_payment.amount::float,
              'payment_method', latest_payment.payment_method,
              'payment_provider', latest_payment.payment_provider,
              'status', latest_payment.status,
              'transaction_code', latest_payment.transaction_code,
              'bank_account', latest_payment.bank_account,
              'transfer_content', latest_payment.transfer_content,
              'paid_at', latest_payment.paid_at,
              'expired_at', latest_payment.expired_at,
              'currency', latest_payment.currency
            )
          END AS latest_payment
       FROM booking b
       INNER JOIN users u ON u.user_id = b.user_id
       INNER JOIN tour t ON t.tour_id = b.tour_id
       LEFT JOIN LATERAL (
          SELECT *
          FROM payment p
          WHERE p.booking_id = b.booking_id
            AND p.deleted_at IS NULL
          ORDER BY p.payment_id DESC
          LIMIT 1
       ) latest_payment ON TRUE
       WHERE b.booking_id = $1`,
      [id]
    );
    return result.rows[0] || null;
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

  async findDetailsByBookingIds(bookingIds = [], executor = db) {
    if (!bookingIds.length) return [];

    const result = await executor.query(
      `SELECT
          booking_detail_id,
          booking_id,
          passenger_name,
          age_category,
          price::float AS price,
          seat_number,
          special_request
       FROM booking_detail
       WHERE booking_id = ANY($1::int[])
       ORDER BY booking_detail_id ASC`,
      [bookingIds]
    );
    return result.rows;
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
         (user_id, tour_id, coupon_id, departure_at, original_amount, discount_amount,
          final_amount, status, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        payload.user_id,
        payload.tour_id,
        payload.coupon_id,
        payload.departure_at,
        payload.original_amount,
        payload.discount_amount,
        payload.final_amount,
        payload.status,
        payload.payment_status,
      ]
    );
    return result.rows[0];
  },

  async createDetails(bookingId, passengers, executor = db) {
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
          passenger.price,
          passenger.seat_number,
          passenger.special_request,
        ]
      );
      details.push(result.rows[0]);
    }
    return details;
  },

  async countBookedSlots(tourId, departureAt, executor = db) {
    const values = [tourId, ACTIVE_BOOKING_STATUSES];
    const departureClause = departureAt ? 'AND b.departure_at = $3' : '';
    if (departureAt) values.push(departureAt);

    const result = await executor.query(
      `SELECT COUNT(bd.booking_detail_id)::int AS booked_slots
       FROM booking b
       INNER JOIN booking_detail bd ON bd.booking_id = b.booking_id
       WHERE b.tour_id = $1
         AND b.status = ANY($2)
         ${departureClause}`,
      values
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

  async markCanceled(bookingId, paymentStatus, cancel = {}, executor = db) {
    const result = await executor.query(
      `UPDATE booking
       SET status = 'canceled',
           payment_status = $2,
           canceled_at = CURRENT_TIMESTAMP,
           canceled_by = $3,
           cancel_reason = $4
       WHERE booking_id = $1
       RETURNING *`,
      [
        bookingId,
        paymentStatus,
        cancel.canceledBy || null,
        cancel.reason || null,
      ]
    );
    return result.rows[0] || null;
  },

  async findNotificationContext(id, executor = db) {
    const result = await executor.query(
      `SELECT b.*,
              u.name AS customer_name,
              u.email AS customer_email,
              u.phone AS customer_phone,
              t.name AS tour_name,
              (
                SELECT COUNT(*)::int
                FROM booking_detail bd
                WHERE bd.booking_id = b.booking_id
              ) AS passenger_count
       FROM booking b
       INNER JOIN users u ON u.user_id = b.user_id
       INNER JOIN tour t ON t.tour_id = b.tour_id
       WHERE b.booking_id = $1`,
      [id]
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
