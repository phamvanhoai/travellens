const db = require('../config/db');

const buildListWhere = (query = {}) => {
  const values = [];
  const clauses = ['deleted_at IS NULL'];

  if (query.location_id) {
    values.push(query.location_id);
    clauses.push(`location_id = $${values.length}`);
  }
  if (query.language) {
    values.push(query.language);
    clauses.push(`language = $${values.length}`);
  }
  if (query.search) {
    values.push(`%${query.search}%`);
    clauses.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length})`);
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
      `SELECT *
       FROM view360
       ${where.text}
       ORDER BY order_index ASC NULLS LAST, view_id ASC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    return result.rows;
  },

  async findActiveById(id, executor = db) {
    const result = await executor.query(
      'SELECT * FROM view360 WHERE view_id = $1 AND deleted_at IS NULL',
      [id]
    );
    return result.rows[0] || null;
  },

  findById(id) {
    return this.findActiveById(id);
  },

  async findByLocation(locationId, executor = db) {
    const result = await executor.query(
      `SELECT *
       FROM view360
       WHERE location_id = $1 AND deleted_at IS NULL
       ORDER BY order_index ASC NULLS LAST, view_id ASC`,
      [locationId]
    );
    return result.rows;
  },

  async createForLocation(locationId, payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO view360
         (location_id, title, description, audio_file, language, order_index)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        locationId,
        payload.title,
        payload.description,
        payload.audio_file,
        payload.language || 'vi',
        payload.order_index,
      ]
    );
    return result.rows[0];
  },

  create(payload) {
    return this.createForLocation(payload.location_id, payload);
  },

  async updateActive(id, payload, executor = db) {
    const fields = ['title', 'description', 'audio_file', 'language', 'order_index']
      .filter((field) => payload[field] !== undefined);

    if (!fields.length) {
      return this.findActiveById(id, executor);
    }

    const values = fields.map((field) => payload[field]);
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    values.push(id);

    const result = await executor.query(
      `UPDATE view360
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE view_id = $${values.length} AND deleted_at IS NULL
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  update(id, payload) {
    return this.updateActive(id, payload);
  },

  async findImageFiles(viewId, executor = db) {
    const result = await executor.query(
      `SELECT image_file
       FROM view360_image
       WHERE view_id = $1 AND deleted_at IS NULL`,
      [viewId]
    );
    return result.rows.map((image) => image.image_file);
  },

  async softDeleteImages(viewId, executor = db) {
    await executor.query(
      `UPDATE view360_image
       SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE view_id = $1 AND deleted_at IS NULL`,
      [viewId]
    );
  },

  async softDelete(id, executor = db) {
    const result = await executor.query(
      `UPDATE view360
       SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE view_id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  },

  async softDeleteWithImages(id) {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');
      const imageFiles = await this.findImageFiles(id, client);
      await this.softDeleteImages(id, client);
      const view = await this.softDelete(id, client);
      await client.query('COMMIT');

      return { view, imageFiles };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  remove(id) {
    return this.softDelete(id);
  },
};
