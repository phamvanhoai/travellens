const db = require('../config/db');

module.exports = {
  async findAll(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;
    const values = [];
    const clauses = ['deleted_at IS NULL'];

    if (query.view_id) {
      values.push(query.view_id);
      clauses.push(`view_id = $${values.length}`);
    }

    values.push(limit, offset);
    const result = await db.query(
      `SELECT *
       FROM view360_image
       WHERE ${clauses.join(' AND ')}
       ORDER BY order_index ASC NULLS LAST, image_id ASC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    return result.rows;
  },

  async findActiveById(id, executor = db) {
    const result = await executor.query(
      'SELECT * FROM view360_image WHERE image_id = $1 AND deleted_at IS NULL',
      [id]
    );
    return result.rows[0] || null;
  },

  findById(id) {
    return this.findActiveById(id);
  },

  async findByView(viewId, executor = db) {
    const result = await executor.query(
      `SELECT *
       FROM view360_image
       WHERE view_id = $1 AND deleted_at IS NULL
       ORDER BY order_index ASC NULLS LAST, image_id ASC`,
      [viewId]
    );
    return result.rows;
  },

  async createForView(viewId, payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO view360_image (view_id, image_file, order_index)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [viewId, payload.image_file, payload.order_index]
    );
    return result.rows[0];
  },

  create(payload) {
    return this.createForView(payload.view_id, payload);
  },

  async updateActive(id, payload, executor = db) {
    const fields = ['image_file', 'order_index']
      .filter((field) => payload[field] !== undefined);

    if (!fields.length) {
      return this.findActiveById(id, executor);
    }

    const values = fields.map((field) => payload[field]);
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    values.push(id);

    const result = await executor.query(
      `UPDATE view360_image
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE image_id = $${values.length} AND deleted_at IS NULL
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  update(id, payload) {
    return this.updateActive(id, payload);
  },

  async softDelete(id, executor = db) {
    const result = await executor.query(
      `UPDATE view360_image
       SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE image_id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  },

  remove(id) {
    return this.softDelete(id);
  },
};
