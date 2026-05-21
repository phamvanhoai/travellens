const BaseService = require('./base.service');
const destinationCategoryModel = require('../models/destinationCategory.model');

module.exports = new BaseService(destinationCategoryModel);

