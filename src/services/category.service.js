const BaseService = require('./base.service');
const categoryModel = require('../models/category.model');

module.exports = new BaseService(categoryModel);

