const BaseService = require('./base.service');
const tourCategoryModel = require('../models/tourCategory.model');

module.exports = new BaseService(tourCategoryModel);

