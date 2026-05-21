const createController = require('./base.controller');
const tourCategoryService = require('../services/tourCategory.service');

module.exports = createController(tourCategoryService);

