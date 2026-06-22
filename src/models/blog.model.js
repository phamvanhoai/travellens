const db = require('../config/db');
const BaseModel = require('./base.model');

class BlogModel extends BaseModel {
  constructor() {
    super({
      table: 'blog',
      primaryKey: 'blog_id',
      fields: ['user_id', 'title', 'content', 'date_created', 'views'],
      searchable: ['title', 'content'],
      filters: ['user_id'],
    });
  }

  async listBlogs(query = {}) {
    let sql = `SELECT * FROM blog`;
    const values = [];

    // SEARCH
    if (query.search) {
      sql += ` WHERE title ILIKE $1 OR content ILIKE $1`;
      values.push(`%${query.search}%`);
    }

    // SORT
    switch (query.sort) {
      case 'newest':
        sql += ` ORDER BY date_created DESC`;
        break;

      case 'oldest':
        sql += ` ORDER BY date_created ASC`;
        break;

      case 'az':
        sql += ` ORDER BY title ASC`;
        break;

      case 'popular':
        sql += ` ORDER BY views DESC`;
        break;

      default:
        sql += ` ORDER BY blog_id DESC`;
    }

    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.max(parseInt(query.limit) || 10, 1);
    const offset = (page - 1) * limit;

    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    const result = await db.query(sql, values);

    return result.rows;
  }
  async findById(blogId) {
    const result = await db.query(
      `SELECT *
     FROM blog
     WHERE blog_id = $1`,
      [blogId]
    );

    return result.rows[0];
  }

  async findForUpdate(blogId, executor = db) {
    const result = await executor.query(
      'SELECT * FROM blog WHERE blog_id = $1 FOR UPDATE',
      [blogId]
    );
    return result.rows[0] || null;
  }

  async createBlog(payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO blog (user_id, title, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [payload.user_id, payload.title, payload.content]
    );
    return result.rows[0];
  }

  async updateBlog(id, payload, executor = db) {
    const fields = ['title', 'content'].filter((field) => payload[field] !== undefined);
    if (!fields.length) return this.findForUpdate(id, executor);
    const values = fields.map((field) => payload[field]);
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    values.push(id);
    const result = await executor.query(
      `UPDATE blog
       SET ${assignments.join(', ')}
       WHERE blog_id = $${values.length}
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  getClient() {
    return db.getClient();
  }
}

module.exports = new BlogModel();
