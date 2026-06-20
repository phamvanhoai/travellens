const BaseService = require('./base.service');
const blogModel = require('../models/blog.model');
const db = require('../config/db');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class BlogService extends BaseService {

  async list(query = {}) {
    return await this.model.listBlogs(query);
  }

  async create(payload, userId) {
    const locationIds = this.normalizeLocationIds(payload.location_ids || []);
    const client = await db.getClient();

    try {
      await client.query('BEGIN');
      await this.ensureLocationsExist(locationIds, client);

      const blogResult = await client.query(
        `INSERT INTO blog (user_id, title, content)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, payload.title, payload.content]
      );
      const blog = blogResult.rows[0];

      await this.replaceLocations(blog.blog_id, locationIds, client);

      await client.query('COMMIT');
      return {
        ...blog,
        location_ids: locationIds,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id, payload, user) {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      const blogResult = await client.query(
        `SELECT *
         FROM blog
         WHERE blog_id = $1
         FOR UPDATE`,
        [id]
      );
      const blog = blogResult.rows[0];

      if (!blog) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Blog not found'
        );
      }

      if (
        user.role !== 'admin' &&
        Number(blog.user_id) !== Number(user.sub)
      ) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'Permission denied'
        );
      }

      let updatedBlog = blog;
      const updatePayload = this.pickBlogFields(payload);
      const updateFields = Object.keys(updatePayload);

      if (updateFields.length) {
        const values = updateFields.map((field) => updatePayload[field]);
        values.push(id);
        const assignments = updateFields.map((field, index) => `${field} = $${index + 1}`);
        const updatedResult = await client.query(
          `UPDATE blog
           SET ${assignments.join(', ')}
           WHERE blog_id = $${values.length}
           RETURNING *`,
          values
        );
        updatedBlog = updatedResult.rows[0];
      }

      if (payload.location_ids !== undefined) {
        const locationIds = this.normalizeLocationIds(payload.location_ids || []);
        await this.ensureLocationsExist(locationIds, client);
        await this.replaceLocations(id, locationIds, client);
        updatedBlog.location_ids = locationIds;
      }

      await client.query('COMMIT');
      return updatedBlog;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async remove(id, user) {

    const blog = await this.model.findById(id);

    if (!blog) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Blog not found'
      );
    }

    if (
      user.role !== 'admin' &&
      Number(blog.user_id) !== Number(user.sub)
    ) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Permission denied'
      );
    }

    return await this.model.remove(id);
  }

  pickBlogFields(payload) {
    const allowedFields = ['title', 'content'];
    return allowedFields.reduce((nextPayload, field) => {
      if (payload[field] !== undefined) {
        nextPayload[field] = payload[field];
      }
      return nextPayload;
    }, {});
  }

  normalizeLocationIds(locationIds) {
    const normalizedIds = locationIds.map((locationId) => Number(locationId));
    const uniqueIds = new Set(normalizedIds);

    if (uniqueIds.size !== normalizedIds.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Duplicate location_id inside one blog is not allowed');
    }

    return normalizedIds;
  }

  async ensureLocationsExist(locationIds, executor) {
    if (!locationIds.length) {
      return;
    }

    const result = await executor.query(
      `SELECT location_id
       FROM location
       WHERE location_id = ANY($1::int[])
         AND deleted_at IS NULL
         AND is_deleted = FALSE`,
      [locationIds]
    );

    if (result.rows.length !== locationIds.length) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }
  }

  async replaceLocations(blogId, locationIds, executor) {
    await executor.query('DELETE FROM blog_location WHERE blog_id = $1', [blogId]);

    for (const locationId of locationIds) {
      await executor.query(
        'INSERT INTO blog_location (blog_id, location_id) VALUES ($1, $2)',
        [blogId, locationId]
      );
    }
  }
}

module.exports = new BlogService(blogModel);
