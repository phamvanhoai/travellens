const BaseService = require('./base.service');
const blogLocationModel = require('../models/blogLocation.model');

module.exports = new BaseService(blogLocationModel);

