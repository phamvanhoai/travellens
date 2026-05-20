const BaseService = require('./base.service');
const couponModel = require('../models/coupon.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class CouponService extends BaseService {
  async create(payload) {
    try {
      return await this.model.create({
        ...payload,
        code: payload.code.toUpperCase().trim(),
        status: payload.status || 'active',
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Coupon code already exists');
      }
      throw error;
    }
  }

  async update(id, payload) {
    const nextPayload = { ...payload };
    if (nextPayload.code) {
      nextPayload.code = nextPayload.code.toUpperCase().trim();
    }

    try {
      return await super.update(id, nextPayload);
    } catch (error) {
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Coupon code already exists');
      }
      throw error;
    }
  }
}

module.exports = new CouponService(couponModel);

