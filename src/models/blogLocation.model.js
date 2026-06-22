const db = require('../config/db');

module.exports = {
  async findAll({ blog_id: blogId, location_id: locationId } = {}) {
    const values = [];
    const clauses = [];

    if (blogId !== undefined) {
      values.push(blogId);
      clauses.push(`blog_id = $${values.length}`);
    }
    if (locationId !== undefined) {
      values.push(locationId);
      clauses.push(`location_id = $${values.length}`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await db.query(`SELECT * FROM blog_location ${where} ORDER BY blog_id DESC`, values);
    return result.rows;
  },

  async findById(id) {
    const [blogId, locationId] = String(id).split(':');
    const result = await db.query(
      'SELECT * FROM blog_location WHERE blog_id = $1 AND location_id = $2',
      [blogId, locationId]
    );
    return result.rows[0] || null;
  },

  async create(payload) {
    const result = await db.query(
      'INSERT INTO blog_location (blog_id, location_id) VALUES ($1, $2) RETURNING *',
      [payload.blog_id, payload.location_id]
    );
    return result.rows[0];
  },

  async update(id, payload) {
    const [blogId, locationId] = String(id).split(':');
    const result = await db.query(
      'UPDATE blog_location SET blog_id = $1, location_id = $2 WHERE blog_id = $3 AND location_id = $4 RETURNING *',
      [payload.blog_id, payload.location_id, blogId, locationId]
    );
    return result.rows[0] || null;
  },

  async remove(id) {
    const [blogId, locationId] = String(id).split(':');
    const result = await db.query(
      'DELETE FROM blog_location WHERE blog_id = $1 AND location_id = $2 RETURNING *',
      [blogId, locationId]
    );
    return result.rows[0] || null;
  },

  async replaceForBlog(blogId, locationIds, executor = db) {
    await executor.query('DELETE FROM blog_location WHERE blog_id = $1', [blogId]);
    if (!locationIds.length) return [];

    const values = [];
    const rows = locationIds.map((locationId, index) => {
      values.push(blogId, locationId);
      const base = index * 2;
      return `($${base + 1}, $${base + 2})`;
    });
    const result = await executor.query(
      `INSERT INTO blog_location (blog_id, location_id)
       VALUES ${rows.join(', ')}
       RETURNING *`,
      values
    );
    return result.rows;
  },
};
