const BaseService = require('./base.service');
const reviewModel = require('../models/review.model');

module.exports = new BaseService(reviewModel);

