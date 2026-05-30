const BaseService = require('./base.service');
const blogModel = require('../models/blog.model');
const blogLocationModel = require('../models/blogLocation.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class BlogService extends BaseService {

  async list(query = {}) {
    return await this.model.listBlogs(query);
  }

  async create(payload, userId) {
    const { location_ids: locationIds = [], ...blogPayload } = payload;
    const blog = await this.model.create({ ...blogPayload, user_id: userId });

    await Promise.all(
      locationIds.map((locationId) =>
        blogLocationModel.create({
          blog_id: blog.blog_id,
          location_id: locationId,
        })
      )
    );

    return {
      ...blog,
      location_ids: locationIds,
    };
  }

  async update(id, payload, user) {

    console.log('USER:', user);

    const blog = await this.model.findById(id);

    if (!blog) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Blog not found'
      );
    }

    console.log('BLOG:', blog);

    console.log(
      'BLOG USER ID:',
      blog.user_id,
      typeof blog.user_id
    );

    console.log(
      'TOKEN USER ID:',
      user.sub,
      typeof user.sub
    );

    if (
      user.role !== 'admin' &&
      Number(blog.user_id) !== Number(user.sub)
    ) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Permission denied'
      );
    }

    return await this.model.update(id, payload);
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
}

module.exports = new BlogService(blogModel);