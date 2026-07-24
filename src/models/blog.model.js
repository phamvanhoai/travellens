const db = require('../config/db');
const BaseModel = require('./base.model');

class BlogModel extends BaseModel {
  constructor() {
    super({
      table: 'blog',
      primaryKey: 'blog_id',
      fields: ['user_id', 'title', 'slug', 'thumbnail', 'content', 'status', 'published_at', 'date_created', 'views'],
      searchable: ['title', 'content'],
      filters: ['user_id'],
    });
  }

  async listBlogs(query = {}) {
    let sql = `SELECT b.*,
        ARRAY(
          SELECT bl.location_id
          FROM blog_location bl
          WHERE bl.blog_id = b.blog_id
          ORDER BY bl.location_id
        ) AS location_ids,
        COALESCE((
          SELECT json_agg(json_build_object(
            'location_id', l.location_id,
            'name', l.name,
            'thumbnail', l.thumbnail,
            'latitude', l.latitude,
            'longitude', l.longitude,
            'destination_id', l.destination_id,
            'travel_destination_id', l.destination_id
          ) ORDER BY l.name)
          FROM blog_location bl
          JOIN location l ON l.location_id = bl.location_id
          WHERE bl.blog_id = b.blog_id
        ), '[]'::json) AS locations,
        ARRAY(
          SELECT bbc.blog_category_id
          FROM blog_blog_category bbc
          WHERE bbc.blog_id = b.blog_id
          ORDER BY bbc.blog_category_id
        ) AS category_ids,
        COALESCE((
          SELECT json_agg(json_build_object(
            'blog_category_id', bc.blog_category_id,
            'name', bc.name,
            'description', bc.description
          ) ORDER BY bc.name)
          FROM blog_blog_category bbc
          JOIN blog_category bc ON bc.blog_category_id = bbc.blog_category_id
          WHERE bbc.blog_id = b.blog_id
        ), '[]'::json) AS categories
      FROM blog b`;
    const values = [];
    const clauses = [];

    // SEARCH
    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`(b.title ILIKE $${values.length} OR b.content ILIKE $${values.length})`);
    }

    if (query.blog_category_id) {
      values.push(query.blog_category_id);
      clauses.push(`EXISTS (
        SELECT 1 FROM blog_blog_category bbc
        WHERE bbc.blog_id = b.blog_id
          AND bbc.blog_category_id = $${values.length}
      )`);
    }

    if (query.public_only) {
      clauses.push(`b.status = 'published' AND (b.published_at IS NULL OR b.published_at <= CURRENT_TIMESTAMP)`);
    } else if (query.status) {
      values.push(query.status);
      clauses.push(`b.status = $${values.length}`);
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
      `SELECT b.*,
         ARRAY(
           SELECT bl.location_id
           FROM blog_location bl
           WHERE bl.blog_id = b.blog_id
           ORDER BY bl.location_id
         ) AS location_ids,
         COALESCE((
           SELECT json_agg(json_build_object(
             'location_id', l.location_id,
             'name', l.name,
             'thumbnail', l.thumbnail,
             'latitude', l.latitude,
             'longitude', l.longitude,
             'destination_id', l.destination_id,
             'travel_destination_id', l.destination_id
           ) ORDER BY l.name)
           FROM blog_location bl
           JOIN location l ON l.location_id = bl.location_id
           WHERE bl.blog_id = b.blog_id
         ), '[]'::json) AS locations,
         ARRAY(
           SELECT bbc.blog_category_id
           FROM blog_blog_category bbc
           WHERE bbc.blog_id = b.blog_id
           ORDER BY bbc.blog_category_id
         ) AS category_ids,
         COALESCE((
           SELECT json_agg(json_build_object(
             'blog_category_id', bc.blog_category_id,
             'name', bc.name,
             'description', bc.description
           ) ORDER BY bc.name)
           FROM blog_blog_category bbc
           JOIN blog_category bc ON bc.blog_category_id = bbc.blog_category_id
           WHERE bbc.blog_id = b.blog_id
         ), '[]'::json) AS categories
       FROM blog b
       WHERE b.blog_id = $1`,
      [blogId]
    );

    return result.rows[0];
  }

  async findBySlug(slug, publicOnly = false) {
    const result = await db.query(
      `SELECT b.* FROM blog b
       WHERE LOWER(b.slug) = LOWER($1)
         ${publicOnly ? "AND b.status = 'published' AND (b.published_at IS NULL OR b.published_at <= CURRENT_TIMESTAMP)" : ''}`,
      [slug]
    );
    return result.rows[0] || null;
  }

  async slugExists(slug, excludeId = null, executor = db) {
    const result = await executor.query(
      `SELECT 1 FROM blog
       WHERE LOWER(slug) = LOWER($1)
         AND ($2::int IS NULL OR blog_id <> $2)
       LIMIT 1`,
      [slug, excludeId]
    );
    return result.rowCount > 0;
  }

  async findForUpdate(blogId, executor = db) {
    const result = await executor.query(
      'SELECT * FROM blog WHERE blog_id = $1 FOR UPDATE',
      [blogId]
    );
    return result.rows[0] || null;
  }

  async createBlog(payload, executor = db) {
    const publishedAtValue = payload.publish_now ? 'CURRENT_TIMESTAMP' : '$7';
    const values = [
      payload.user_id,
      payload.title,
      payload.slug,
      payload.thumbnail,
      payload.content,
      payload.status,
    ];
    if (!payload.publish_now) {
      values.push(payload.published_at);
    }
    const result = await executor.query(
      `INSERT INTO blog (user_id, title, slug, thumbnail, content, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, ${publishedAtValue})
       RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async updateBlog(id, payload, executor = db) {
    const fields = ['title', 'slug', 'thumbnail', 'content', 'status', 'published_at']
      .filter((field) => payload[field] !== undefined);
    if (payload.publish_now && !fields.includes('published_at')) {
      fields.push('published_at');
    }
    if (!fields.length) return this.findForUpdate(id, executor);
    const values = [];
    const assignments = fields.map((field) => {
      if (field === 'published_at' && payload.publish_now) {
        return 'published_at = CURRENT_TIMESTAMP';
      }
      values.push(payload[field]);
      return `${field} = $${values.length}`;
    });
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
