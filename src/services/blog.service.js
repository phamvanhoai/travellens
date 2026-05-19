const BaseService = require('./base.service');
const blogModel = require('../models/blog.model');
const blogLocationModel = require('../models/blogLocation.model');

class BlogService extends BaseService {
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

