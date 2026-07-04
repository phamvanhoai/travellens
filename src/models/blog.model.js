const db = require('../config/db');
const BaseModel = require('./base.model');

class BlogModel extends BaseModel {
  constructor() {
    super({
      table: 'blog',
      primaryKey: 'blog_id',
      fields: ['user_id', 'blog_category_id', 'title', 'content', 'date_created', 'views'],
      searchable: ['title', 'content'],
      filters: ['user_id', 'blog_category_id'],
    });
  }

  async listBlogs(query = {}) {
    let sql = `SELECT b.*, bc.name AS blog_category
      FROM blog b
      LEFT JOIN blog_category bc ON bc.blog_category_id = b.blog_category_id`;
    const values = [];
    const clauses = [];

    // SEARCH
    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`(b.title ILIKE $${values.length} OR b.content ILIKE $${values.length})`);
    }

    if (query.blog_category_id) {
      values.push(query.blog_category_id);
      clauses.push(`b.blog_category_id = $${values.length}`);
    }

    if (clauses.length) {
      sql += ` WHERE ${clauses.join(' AND ')}`;
    }

    // SORT
    switch (query.sort) {
      case 'newest':
        sql += ` ORDER BY b.date_created DESC`;
        break;

      case 'oldest':
        sql += ` ORDER BY b.date_created ASC`;
        break;

      case 'az':
        sql += ` ORDER BY b.title ASC`;
        break;

      case 'popular':
        sql += ` ORDER BY b.views DESC`;
        break;

      default:
        sql += ` ORDER BY b.blog_id DESC`;
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
      `SELECT b.*, bc.name AS blog_category
       FROM blog b
       LEFT JOIN blog_category bc ON bc.blog_category_id = b.blog_category_id
       WHERE b.blog_id = $1`,
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
      `INSERT INTO blog (user_id, blog_category_id, title, content)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [payload.user_id, payload.blog_category_id, payload.title, payload.content]
    );
    return result.rows[0];
  }

  async updateBlog(id, payload, executor = db) {
    const fields = ['blog_category_id', 'title', 'content'].filter((field) => payload[field] !== undefined);
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
