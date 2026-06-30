const db = require('../config/db');

const SORT_COLUMNS = {
  coupon_id: 'coupon_id',
  code: 'code',
  name: 'name',
  created_at: 'created_at',
  updated_at: 'updated_at',
  start_date: 'start_date',
  end_date: 'end_date',
};

const buildListWhere = (query = {}) => {
  const values = [];
  const clauses = ['deleted_at IS NULL'];

  if (query.search) {
    values.push(`%${query.search}%`);
    clauses.push(`(code ILIKE $${values.length} OR name ILIKE $${values.length})`);
  }
  if (query.status) {
    values.push(query.status);
    clauses.push(`status = $${values.length}`);
  }
  if (query.discount_type) {
    values.push(query.discount_type);
    clauses.push(`discount_type = $${values.length}`);
  }

  return {
    text: `WHERE ${clauses.join(' AND ')}`,
    values,
  };
};

module.exports = {
  async findAllWithPagination(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
    const offset = (page - 1) * limit;
    const where = buildListWhere(query);
    const sortBy = SORT_COLUMNS[query.sortBy] || SORT_COLUMNS.created_at;
    const sortOrder = String(query.sortOrder || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const countResult = await db.query(`SELECT COUNT(*)::int AS total FROM coupon ${where.text}`, where.values);
    const values = [...where.values, limit, offset];
    const result = await db.query(
      `SELECT *
       FROM coupon
       ${where.text}
       ORDER BY ${sortBy} ${sortOrder}, coupon_id DESC
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

  async findActiveById(id) {
    const result = await db.query(
      'SELECT * FROM coupon WHERE coupon_id = $1 AND deleted_at IS NULL',
      [id]
    );
    return result.rows[0] || null;
  },

  async findByCode(code, executor = db) {
    const result = await executor.query(
      'SELECT * FROM coupon WHERE code = $1 AND deleted_at IS NULL',
      [code.toUpperCase().trim()]
    );
    return result.rows[0] || null;
  },

  async createCoupon(payload) {
    const result = await db.query(
      `INSERT INTO coupon
         (code, name, description, discount_type, discount_value, max_discount_amount,
          min_order_amount, usage_limit, start_date, end_date, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        payload.code,
        payload.name,
        payload.description,
        payload.discount_type,
        payload.discount_value,
        payload.max_discount_amount,
        payload.min_order_amount,
        payload.usage_limit,
        payload.start_date,
        payload.end_date,
        payload.status,
        payload.created_by,
      ]
    );
    return result.rows[0];
  },

  async updateCoupon(id, payload) {
    const fields = [
      'name',
      'description',
      'discount_type',
      'discount_value',
      'max_discount_amount',
      'min_order_amount',
      'usage_limit',
      'start_date',
      'end_date',
      'status',
    ].filter((field) => payload[field] !== undefined);

    if (!fields.length) {
      return this.findActiveById(id);
    }

    const values = fields.map((field) => payload[field]);
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    values.push(id);

    const result = await db.query(
      `UPDATE coupon
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE coupon_id = $${values.length} AND deleted_at IS NULL
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async softDeleteCoupon(id) {
    const result = await db.query(
      `UPDATE coupon
       SET deleted_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP,
           status = 'inactive'
       WHERE coupon_id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  },

  async archiveCoupon(id) {
    const result = await db.query(
      `UPDATE coupon
       SET status = 'archived',
           archived_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE coupon_id = $1
         AND deleted_at IS NULL
         AND status <> 'archived'
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  },

  async getUsageStats(id) {
    const result = await db.query(
      `SELECT
         c.used_count::int AS used_count,
         COUNT(b.booking_id)::int AS booking_count
       FROM coupon c
       LEFT JOIN booking b ON b.coupon_id = c.coupon_id
       WHERE c.coupon_id = $1 AND c.deleted_at IS NULL
       GROUP BY c.coupon_id`,
      [id]
    );
    return result.rows[0] || null;
  },

  async incrementUsedCount(id, executor = db) {
    const result = await executor.query(
      `UPDATE coupon
       SET used_count = used_count + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE coupon_id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  },
};
