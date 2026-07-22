const db = require('../config/db');

const ACTIVE_BOOKING_STATUSES = ['pending', 'waiting_manual_confirmation', 'confirmed', 'cancel_pending', 'paid'];

module.exports = {
  async listByTour(tourId, { publicOnly = false, page, limit, search, status, dateFrom, dateTo } = {}, executor = db) {
    const conditions = ['td.tour_id = $1', 'td.deleted_at IS NULL'];
    const params = [tourId, ACTIVE_BOOKING_STATUSES];
    if (publicOnly) conditions.push("td.status = 'open'", 'td.departure_at > CURRENT_TIMESTAMP', '(td.booking_open_at IS NULL OR td.booking_open_at <= CURRENT_TIMESTAMP)', '(td.booking_close_at IS NULL OR td.booking_close_at > CURRENT_TIMESTAMP)');
    if (!publicOnly && status) { params.push(status); conditions.push(`td.status = $${params.length}`); }
    if (!publicOnly && dateFrom) { params.push(dateFrom); conditions.push(`td.departure_at >= $${params.length}::date`); }
    if (!publicOnly && dateTo) { params.push(dateTo); conditions.push(`td.departure_at < ($${params.length}::date + INTERVAL '1 day')`); }
    if (!publicOnly && search) { params.push(`%${search}%`); conditions.push(`(td.status ILIKE $${params.length} OR TO_CHAR(td.departure_at AT TIME ZONE 'Asia/Ho_Chi_Minh', 'DD/MM/YYYY HH24:MI') ILIKE $${params.length})`); }
    let paginationSql = '';
    if (!publicOnly && page && limit) { params.push(limit, (page - 1) * limit); paginationSql = ` LIMIT $${params.length - 1} OFFSET $${params.length}`; }
    const result = await executor.query(
      `SELECT td.*,
              COALESCE((SELECT COUNT(bd.booking_detail_id)::int FROM booking b JOIN booking_detail bd ON bd.booking_id = b.booking_id WHERE b.tour_departure_id = td.tour_departure_id AND b.status = ANY($2)), 0)::int AS booked_slots
       FROM tour_departure td
       WHERE ${conditions.join(' AND ')}
       ORDER BY td.departure_at ASC${paginationSql}`,
      params
    );
    const items = result.rows.map((item) => ({ ...item, available_slots: Math.max(0, Number(item.capacity) - Number(item.booked_slots)) }));
    if (publicOnly || !page || !limit) return items;
    const countParams = params.slice(0, params.length - 2);
    const count = await executor.query(`SELECT COUNT(*)::int AS total FROM tour_departure td WHERE ${conditions.join(' AND ')} AND $2::text[] IS NOT NULL`, countParams);
    const total = Number(count.rows[0]?.total || 0);
    return { items, pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
  },

  async findById(id, executor = db) {
    const result = await executor.query('SELECT * FROM tour_departure WHERE tour_departure_id = $1 AND deleted_at IS NULL', [id]);
    return result.rows[0] || null;
  },

  async findForUpdate(id, executor) {
    const result = await executor.query('SELECT * FROM tour_departure WHERE tour_departure_id = $1 AND deleted_at IS NULL FOR UPDATE', [id]);
    return result.rows[0] || null;
  },

  async countBookedSlots(id, executor = db) {
    const result = await executor.query(
      `SELECT COUNT(bd.booking_detail_id)::int AS total FROM booking b JOIN booking_detail bd ON bd.booking_id = b.booking_id WHERE b.tour_departure_id = $1 AND b.status = ANY($2)`,
      [id, ACTIVE_BOOKING_STATUSES]
    );
    return Number(result.rows[0]?.total || 0);
  },

  async countBookings(id, executor = db) {
    const result = await executor.query('SELECT COUNT(*)::int AS total FROM booking WHERE tour_departure_id = $1', [id]);
    return Number(result.rows[0]?.total || 0);
  },

  async create(payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO tour_departure (tour_id, departure_at, capacity, price, child_price, infant_price, currency, booking_open_at, booking_close_at, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [payload.tour_id, payload.departure_at, payload.capacity, payload.price, payload.child_price, payload.infant_price, payload.currency, payload.booking_open_at || null, payload.booking_close_at || null, payload.status]
    );
    return result.rows[0];
  },

  async bulkCreate(items, executor = db) {
    if (!items.length) return [];
    const result = await executor.query(
      `INSERT INTO tour_departure (tour_id, departure_at, capacity, price, child_price, infant_price, currency, booking_open_at, booking_close_at, status)
       SELECT x.tour_id, x.departure_at, x.capacity, x.price, x.child_price, x.infant_price, x.currency, x.booking_open_at, x.booking_close_at, x.status
       FROM jsonb_to_recordset($1::jsonb) AS x(
         tour_id integer, departure_at timestamptz, capacity integer, price numeric, child_price numeric,
         infant_price numeric, currency varchar(3), booking_open_at timestamptz, booking_close_at timestamptz, status varchar(20)
       )
       ON CONFLICT (tour_id, departure_at) DO NOTHING
       RETURNING *`,
      [JSON.stringify(items)]
    );
    return result.rows;
  },

  async update(id, payload, executor = db) {
    const fields = ['departure_at', 'capacity', 'price', 'child_price', 'infant_price', 'currency', 'booking_open_at', 'booking_close_at', 'status'];
    const entries = fields.filter((field) => payload[field] !== undefined);
    if (!entries.length) return this.findById(id, executor);
    const values = entries.map((field) => payload[field]);
    values.push(id);
    const result = await executor.query(
      `UPDATE tour_departure SET ${entries.map((field, index) => `${field} = $${index + 1}`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE tour_departure_id = $${values.length} AND deleted_at IS NULL RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async softDelete(id, executor = db) {
    const result = await executor.query("UPDATE tour_departure SET deleted_at = CURRENT_TIMESTAMP, status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE tour_departure_id = $1 AND deleted_at IS NULL RETURNING *", [id]);
    return result.rows[0] || null;
  },
};
