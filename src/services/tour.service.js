const BaseService = require('./base.service');
const tourModel = require('../models/tour.model');

module.exports = new BaseService(tourModel);

