const BaseService = require('./base.service');
const blogCategoryModel = require('../models/blogCategory.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class BlogCategoryService extends BaseService {
  async create(payload) {
    try {
      return await super.create(payload);
    } catch (error) {
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Blog category name already exists');
      }
      throw error;
    }
  }

  async update(id, payload) {
    try {
      return await super.update(id, payload);
    } catch (error) {
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Blog category name already exists');
      }
      throw error;
    }
  }

  async remove(id) {
    await this.get(id);
    const totalBlogs = await this.model.countBlogs(id);

    if (totalBlogs > 0) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Cannot delete blog category because it has linked blogs',
        { total_blogs: totalBlogs }
      );
    }

    return super.remove(id);
  }
}

module.exports = new BlogCategoryService(blogCategoryModel);
