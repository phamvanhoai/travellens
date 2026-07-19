const db = require('../config/db');

class TourContentItemModel {
  async findAll(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 50), 1), 100);
    const offset = (page - 1) * limit;
    const values = [];
    const clauses = ['deleted_at IS NULL'];
    if (query.type) {
      values.push(query.type);
      clauses.push(`type = $${values.length}`);
    }
    if (query.status) {
      values.push(query.status);
      clauses.push(`status = $${values.length}`);
    }
    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`content ILIKE $${values.length}`);
    }
    const where = `WHERE ${clauses.join(' AND ')}`;
    const count = await db.query(`SELECT COUNT(*)::int AS total FROM tour_content_item ${where}`, values);
    const result = await db.query(
      `SELECT * FROM tour_content_item ${where}
       ORDER BY type ASC, content ASC
       LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, limit, offset]
    );
    const total = count.rows[0].total;
    return { items: result.rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id) {
    const result = await db.query(
      'SELECT * FROM tour_content_item WHERE content_item_id = $1 AND deleted_at IS NULL', [id]
    );
    return result.rows[0] || null;
  }

  async findActiveByIds(ids, client = db) {
    if (!ids.length) return [];
    const result = await client.query(
      `SELECT * FROM tour_content_item
       WHERE content_item_id = ANY($1::int[]) AND status = 'active' AND deleted_at IS NULL
       ORDER BY array_position($1::int[], content_item_id)`,
      [ids]
    );
    return result.rows;
  }

  async findDuplicate(type, content, excludeId) {
    const values = [type, content];
    if (excludeId) values.push(excludeId);
    const result = await db.query(
      `SELECT content_item_id FROM tour_content_item
       WHERE type = $1 AND LOWER(content) = LOWER($2) AND deleted_at IS NULL
       ${excludeId ? 'AND content_item_id <> $3' : ''}`,
      values
    );
    return result.rows[0] || null;
  }

  async create(payload) {
    const result = await db.query(
      `INSERT INTO tour_content_item (type, content, status)
       VALUES ($1, $2, COALESCE($3, 'active')) RETURNING *`,
      [payload.type, payload.content, payload.status]
    );
    return result.rows[0];
  }

  async update(id, payload) {
    const fields = ['type', 'content', 'status'].filter((field) => payload[field] !== undefined);
    if (!fields.length) return this.findById(id);
    const values = fields.map((field) => payload[field]);
    values.push(id);
    const result = await db.query(
      `UPDATE tour_content_item
       SET ${fields.map((field, index) => `${field} = $${index + 1}`).join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE content_item_id = $${values.length} AND deleted_at IS NULL RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async remove(id) {
    const result = await db.query(
      `UPDATE tour_content_item SET deleted_at = CURRENT_TIMESTAMP, status = 'inactive', updated_at = CURRENT_TIMESTAMP
       WHERE content_item_id = $1 AND deleted_at IS NULL RETURNING content_item_id`,
      [id]
    );
    return result.rows[0] || null;
  }
}

module.exports = new TourContentItemModel();
