const createController = require('./base.controller');
const destinationCategoryService = require('../services/destinationCategory.service');

module.exports = createController(destinationCategoryService);

