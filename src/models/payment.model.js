const db = require('../config/db');

const paymentColumns = `
  p.payment_id,
  p.booking_id,
  p.payment_code,
  p.amount,
  p.payment_method,
  p.payment_provider,
  p.status,
  p.transaction_code,
  p.sepay_transaction_id,
  p.bank_account,
  p.transfer_content,
  p.paid_at,
  p.expired_at,
  p.currency,
  p.created_at,
  p.updated_at,
  p.deleted_at
`;

const buildListWhere = (query = {}) => {
  const values = [];
  const clauses = ['p.deleted_at IS NULL'];

  if (query.booking_id) {
    values.push(query.booking_id);
    clauses.push(`p.booking_id = $${values.length}`);
  }
  if (query.status) {
    values.push(query.status);
    clauses.push(`p.status = $${values.length}`);
  }
  if (query.search) {
    values.push(`%${query.search}%`);
    clauses.push(`(p.payment_code ILIKE $${values.length} OR p.transaction_code ILIKE $${values.length})`);
  }

  return {
    text: `WHERE ${clauses.join(' AND ')}`,
    values,
  };
};

module.exports = {
  async findAll(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;
    const where = buildListWhere(query);
    const values = [...where.values, limit, offset];

    const result = await db.query(
      `SELECT ${paymentColumns}
       FROM payment p
       ${where.text}
       ORDER BY p.payment_id DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );
    return result.rows;
  },

  async findById(id) {
    const result = await db.query(
      `SELECT ${paymentColumns}
       FROM payment p
       WHERE p.payment_id = $1 AND p.deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] || null;
  },

  async findOwnedById(id, userId) {
    const result = await db.query(
      `SELECT ${paymentColumns},
              b.user_id,
              b.status AS booking_status,
              b.payment_status AS booking_payment_status
       FROM payment p
       JOIN booking b ON b.booking_id = p.booking_id
       WHERE p.payment_id = $1
         AND b.user_id = $2
         AND p.deleted_at IS NULL`,
      [id, userId]
    );
    return result.rows[0] || null;
  },

  async findPendingByCodeForUpdate(paymentCode, client) {
    const result = await client.query(
      `SELECT p.*,
              b.user_id,
              b.coupon_id,
              b.status AS booking_status,
              b.payment_status AS booking_payment_status
       FROM payment p
       JOIN booking b ON b.booking_id = p.booking_id
       WHERE p.payment_code = $1
         AND p.deleted_at IS NULL
       FOR UPDATE OF p, b`,
      [paymentCode]
    );
    return result.rows[0] || null;
  },

  async create(payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO payment
         (booking_id, payment_code, amount, payment_method, payment_provider, status,
          bank_account, transfer_content, expired_at, currency)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        payload.booking_id,
        payload.payment_code,
        payload.amount,
        payload.payment_method,
        payload.payment_provider,
        payload.status,
        payload.bank_account,
        payload.transfer_content,
        payload.expired_at,
        payload.currency,
      ]
    );
    return result.rows[0];
  },

  async markPaid(id, payload, executor = db) {
    const result = await executor.query(
      `UPDATE payment
       SET status = 'paid',
           transaction_code = $2,
           sepay_transaction_id = $3,
           bank_account = COALESCE($4, bank_account),
           transfer_content = $5,
           paid_at = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE payment_id = $1
       RETURNING *`,
      [
        id,
        payload.transaction_code,
        payload.sepay_transaction_id,
        payload.bank_account,
        payload.transfer_content,
        payload.paid_at,
      ]
    );
    return result.rows[0] || null;
  },

  async markFailed(id, payload = {}, executor = db) {
    const result = await executor.query(
      `UPDATE payment
       SET status = 'failed',
           transaction_code = COALESCE($2, transaction_code),
           sepay_transaction_id = COALESCE($3, sepay_transaction_id),
           transfer_content = COALESCE($4, transfer_content),
           updated_at = CURRENT_TIMESTAMP
       WHERE payment_id = $1
       RETURNING *`,
      [id, payload.transaction_code, payload.sepay_transaction_id, payload.transfer_content]
    );
    return result.rows[0] || null;
  },

  async updateStatus(id, status, payload = {}, executor = db) {
    const result = await executor.query(
      `UPDATE payment
       SET status = $2,
           transaction_code = COALESCE($3, transaction_code),
           updated_at = CURRENT_TIMESTAMP
       WHERE payment_id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id, status, payload.transaction_code]
    );
    return result.rows[0] || null;
  },
};
