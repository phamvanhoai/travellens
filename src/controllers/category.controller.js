const createController = require('./base.controller');
const categoryService = require('../services/category.service');

module.exports = createController(categoryService);

