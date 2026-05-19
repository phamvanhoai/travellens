const createController = require('./base.controller');
const bookingDetailService = require('../services/bookingDetail.service');

module.exports = createController(bookingDetailService);

