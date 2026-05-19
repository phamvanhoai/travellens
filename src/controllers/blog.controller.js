const createController = require('./base.controller');
const blogService = require('../services/blog.service');

module.exports = createController(blogService);

