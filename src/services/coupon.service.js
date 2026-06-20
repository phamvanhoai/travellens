const couponModel = require('../models/coupon.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class CouponService {
  async list(query) {
    return couponModel.findAllWithPagination(query);
  }

  async get(id) {
    const coupon = await couponModel.findActiveById(id);
    if (!coupon) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
    }
    return coupon;
  }

  async create(payload, staffUserId) {
    const nextPayload = {
      ...payload,
      code: payload.code.toUpperCase().trim(),
      status: payload.status || 'active',
      min_order_amount: payload.min_order_amount || 0,
      used_count: 0,
      created_by: staffUserId,
    };

    this.validateBusinessRules(nextPayload);

    const duplicate = await couponModel.findByCode(nextPayload.code);
    if (duplicate) {
      throw new ApiError(httpStatus.CONFLICT, 'Coupon code already exists');
    }

    try {
      return await couponModel.createCoupon(nextPayload);
    } catch (error) {
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Coupon code already exists');
      }
      throw error;
    }
  }

  async update(id, payload) {
    const coupon = await this.get(id);
    const nextPayload = { ...payload };

    if (coupon.status === 'archived') {
      throw new ApiError(httpStatus.CONFLICT, 'Archived coupon cannot be updated');
    }

    if (nextPayload.usage_limit !== undefined && nextPayload.usage_limit !== null) {
      if (Number(nextPayload.usage_limit) < Number(coupon.used_count)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Usage limit cannot be lower than used count');
      }
    }

    this.validateBusinessRules({
      ...coupon,
      ...nextPayload,
    });

    const updated = await couponModel.updateCoupon(id, nextPayload);
    if (!updated) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
    }
    return updated;
  }

  async remove(id) {
    const coupon = await this.get(id);

    if (coupon.status === 'archived') {
      throw new ApiError(httpStatus.CONFLICT, 'Archived coupon cannot be deleted');
    }

    const usageStats = await couponModel.getUsageStats(id);
    const usedCount = Number(usageStats?.used_count ?? coupon.used_count ?? 0);
    const bookingCount = Number(usageStats?.booking_count ?? 0);

    if (usedCount > 0 || bookingCount > 0) {
      throw new ApiError(httpStatus.CONFLICT, 'Coupon has been used and cannot be deleted', {
        used_count: usedCount,
        booking_count: bookingCount,
      });
    }

    const deleted = await couponModel.softDeleteCoupon(id);
    if (!deleted) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
    }
    return deleted;
  }

  async archive(id) {
    const coupon = await this.get(id);
    if (coupon.status === 'archived') {
      throw new ApiError(httpStatus.CONFLICT, 'Coupon is already archived');
    }

    const archived = await couponModel.archiveCoupon(id);
    if (!archived) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
    }
    return archived;
  }

  async validateCoupon({ code, booking_amount: bookingAmount }) {
    const coupon = await couponModel.findByCode(code);
    if (!coupon) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
    }

    const now = new Date();
    const startDate = coupon.start_date ? new Date(coupon.start_date) : null;
    const endDate = coupon.end_date ? new Date(coupon.end_date) : null;
    if (endDate) {
      endDate.setHours(23, 59, 59, 999);
    }

    if (coupon.status !== 'active') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Coupon is not active');
    }
    if (startDate && now < startDate) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Coupon is not active yet');
    }
    if (endDate && now > endDate) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Coupon has expired');
    }
    if (Number(bookingAmount) < Number(coupon.min_order_amount || 0)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Booking amount does not meet minimum order amount');
    }
    if (coupon.usage_limit !== null && Number(coupon.used_count) >= Number(coupon.usage_limit)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Coupon usage limit reached');
    }

    let discountAmount = coupon.discount_type === 'percentage'
      ? Number(bookingAmount) * Number(coupon.discount_value) / 100
      : Number(coupon.discount_value);

    if (coupon.max_discount_amount !== null && coupon.max_discount_amount !== undefined) {
      discountAmount = Math.min(discountAmount, Number(coupon.max_discount_amount));
    }
    discountAmount = Math.min(discountAmount, Number(bookingAmount));

    return {
      coupon_id: coupon.coupon_id,
      code: coupon.code,
      discount_amount: discountAmount,
      final_amount: Number(bookingAmount) - discountAmount,
    };
  }

  async markUsed(couponId, executor) {
    if (!couponId) {
      return null;
    }
    return couponModel.incrementUsedCount(couponId, executor);
  }

  validateBusinessRules(payload) {
    if (payload.discount_type === 'percentage') {
      if (Number(payload.discount_value) < 1 || Number(payload.discount_value) > 100) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Percentage discount value must be between 1 and 100 (inclusive)');
      }
    }

    if (payload.discount_type === 'fixed' && Number(payload.discount_value) <= 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Fixed discount value must be greater than 0');
    }

    if (Number(payload.min_order_amount || 0) < 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Minimum order amount must be greater than or equal to 0');
    }

    if (payload.usage_limit !== undefined && payload.usage_limit !== null && Number(payload.usage_limit) <= 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Usage limit must be greater than 0');
    }

    if (payload.start_date && payload.end_date && new Date(payload.start_date) >= new Date(payload.end_date)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Start date must be before end date');
    }
  }
}

module.exports = new CouponService();
