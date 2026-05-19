const createController = require('./base.controller');
const reviewService = require('../services/review.service');

module.exports = createController(reviewService);

