const createController = require('./base.controller');
const couponService = require('../services/coupon.service');

module.exports = createController(couponService);

