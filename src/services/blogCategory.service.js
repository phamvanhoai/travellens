const BaseService = require('./base.service');
const blogCategoryModel = require('../models/blogCategory.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class BlogCategoryService extends BaseService {
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
