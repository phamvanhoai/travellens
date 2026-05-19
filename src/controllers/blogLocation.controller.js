const createController = require('./base.controller');
const blogLocationService = require('../services/blogLocation.service');

module.exports = createController(blogLocationService);

