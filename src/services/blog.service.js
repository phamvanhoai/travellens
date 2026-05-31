const BaseService = require('./base.service');
const blogModel = require('../models/blog.model');
const blogLocationModel = require('../models/blogLocation.model');
const db = require('../config/db');

class BlogService extends BaseService {

  async list(query = {}) {

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

    // PAGINATION
    const page = parseInt(query.page) || 1;

    const limit = parseInt(query.limit) || 10;

    const offset = (page - 1) * limit;

    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    const result = await db.query(sql, values);

    return result.rows;
  }


  async create(payload) {
    const { location_ids: locationIds = [], ...blogPayload } = payload;
    const blog = await this.model.create(blogPayload);

    await Promise.all(locationIds.map((locationId) => blogLocationModel.create({
      blog_id: blog.blog_id,
      location_id: locationId,
    })));

    return {
      ...blog,
      location_ids: locationIds,
    };
  }
}

module.exports = new BlogService(blogModel);