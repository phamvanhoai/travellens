const createController = require('./base.controller');
const blogCategoryService = require('../services/blogCategory.service');

module.exports = createController(blogCategoryService);
