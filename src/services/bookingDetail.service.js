const BaseService = require('./base.service');
const bookingDetailModel = require('../models/bookingDetail.model');

module.exports = new BaseService(bookingDetailModel);

