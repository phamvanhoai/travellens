const createController = require('./base.controller');
const tourService = require('../services/tour.service');

module.exports = createController(tourService);

