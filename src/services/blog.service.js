const BaseService = require('./base.service');
const blogModel = require('../models/blog.model');
const blogLocationModel = require('../models/blogLocation.model');
const locationModel = require('../models/location.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const richTextService = require('./richText.service');

class BlogService extends BaseService {

  async list(query = {}) {
    return await this.model.listBlogs(query);
  }

  async create(payload, userId) {
    const locationIds = this.normalizeLocationIds(payload.location_ids || []);
    const content = await this.prepareContent(payload.content);
    const client = await blogModel.getClient();

    try {
      await client.query('BEGIN');
      await this.ensureLocationsExist(locationIds, client);

      const blog = await blogModel.createBlog({
        user_id: userId,
        title: payload.title,
        content,
      }, client);

      await blogLocationModel.replaceForBlog(blog.blog_id, locationIds, client);

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
    if (payload.content !== undefined) {
      payload = {
        ...payload,
        content: await this.prepareContent(payload.content),
      };
    }
    const client = await blogModel.getClient();

    try {
      await client.query('BEGIN');

      const blog = await blogModel.findForUpdate(id, client);

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
      if (Object.keys(updatePayload).length) {
        updatedBlog = await blogModel.updateBlog(id, updatePayload, client);
      }

      if (payload.location_ids !== undefined) {
        const locationIds = this.normalizeLocationIds(payload.location_ids || []);
        await this.ensureLocationsExist(locationIds, client);
        await blogLocationModel.replaceForBlog(id, locationIds, client);
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

  async prepareContent(content) {
    return richTextService.prepare(content, 'Blog content');
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

    const existingIds = await locationModel.findExistingActiveIds(locationIds, executor);
    if (existingIds.length !== locationIds.length) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }
  }
}

module.exports = new BlogService(blogModel);
