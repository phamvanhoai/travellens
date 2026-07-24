const BaseService = require('./base.service');
const blogModel = require('../models/blog.model');
const blogLocationModel = require('../models/blogLocation.model');
const locationModel = require('../models/location.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const blogContent = require('../utils/blogContent');
const blogCategoryModel = require('../models/blogCategory.model');
const blogCategoryLinkModel = require('../models/blogCategoryLink.model');

class BlogService extends BaseService {

  async list(query = {}) {
    return await this.model.listBlogs(query);
  }

  async listPublic(query = {}) {
    return this.model.listBlogs({ ...query, public_only: true });
  }

  async getPublic(idOrSlug) {
    const blog = /^\d+$/.test(String(idOrSlug))
      ? await this.model.findById(idOrSlug)
      : await this.model.findBySlug(idOrSlug, true);
    if (!blog || blog.status !== 'published'
      || (blog.published_at && new Date(blog.published_at) > new Date())) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
    }
    return blog;
  }

  async create(payload, userId) {
    const locationIds = this.normalizeLocationIds(payload.location_ids || []);
    const categoryIds = this.normalizeCategoryIds(payload.category_ids || []);
    const content = await this.prepareContent(payload.content);
    const client = await blogModel.getClient();

    try {
      await client.query('BEGIN');
      await this.ensureLocationsExist(locationIds, client);
      await this.ensureBlogCategoriesExist(categoryIds, client);

      const slug = await this.resolveSlug(payload.slug, payload.title, null, client);
      const status = payload.status || 'published';

      const blog = await blogModel.createBlog({
        user_id: userId,
        title: payload.title,
        slug,
        thumbnail: payload.thumbnail || null,
        content,
        status,
        published_at: status === 'published' ? (payload.published_at || null) : null,
        publish_now: status === 'published' && !payload.published_at,
      }, client);

      await blogLocationModel.replaceForBlog(blog.blog_id, locationIds, client);
      await blogCategoryLinkModel.replaceForBlog(blog.blog_id, categoryIds, client);

      await client.query('COMMIT');
      return {
        ...blog,
        location_ids: locationIds,
        category_ids: categoryIds,
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
      if (payload.slug !== undefined) {
        updatePayload.slug = await this.resolveSlug(payload.slug, payload.title || blog.title, id, client);
      }
      if (payload.status === 'published' && payload.published_at === undefined && !blog.published_at) {
        updatePayload.publish_now = true;
      }
      if (Object.keys(updatePayload).length) {
        updatedBlog = await blogModel.updateBlog(id, updatePayload, client);
      }

      if (payload.location_ids !== undefined) {
        const locationIds = this.normalizeLocationIds(payload.location_ids || []);
        await this.ensureLocationsExist(locationIds, client);
        await blogLocationModel.replaceForBlog(id, locationIds, client);
        updatedBlog.location_ids = locationIds;
      }

      if (payload.category_ids !== undefined) {
        const categoryIds = this.normalizeCategoryIds(payload.category_ids || []);
        await this.ensureBlogCategoriesExist(categoryIds, client);
        await blogCategoryLinkModel.replaceForBlog(id, categoryIds, client);
        updatedBlog.category_ids = categoryIds;
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
    const allowedFields = ['title', 'thumbnail', 'content', 'status', 'published_at'];
    return allowedFields.reduce((nextPayload, field) => {
      if (payload[field] !== undefined) {
        nextPayload[field] = payload[field];
      }
      return nextPayload;
    }, {});
  }

  async prepareContent(content) {
    return blogContent.sanitize(content);
  }

  slugify(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 255);
  }

  async resolveSlug(requestedSlug, title, excludeId, executor) {
    const base = this.slugify(requestedSlug || title) || 'blog';
    if (requestedSlug && await blogModel.slugExists(base, excludeId, executor)) {
      throw new ApiError(httpStatus.CONFLICT, 'Blog URL is already in use');
    }

    let slug = base;
    let suffix = 2;
    while (await blogModel.slugExists(slug, excludeId, executor)) {
      const tail = `-${suffix++}`;
      slug = `${base.slice(0, 255 - tail.length)}${tail}`;
    }
    return slug;
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

  normalizeCategoryIds(categoryIds) {
    const normalizedIds = categoryIds.map((categoryId) => Number(categoryId));
    if (new Set(normalizedIds).size !== normalizedIds.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Duplicate category_id inside one blog is not allowed');
    }
    return normalizedIds;
  }

  async ensureBlogCategoriesExist(categoryIds, executor) {
    if (!categoryIds.length) return;
    const existingIds = await blogCategoryModel.findExistingIds(categoryIds, executor);
    if (existingIds.length !== categoryIds.length) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Blog category not found');
    }
  }
}

module.exports = new BlogService(blogModel);
