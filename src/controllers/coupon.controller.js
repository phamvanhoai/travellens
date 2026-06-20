const couponService = require('../services/coupon.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const { httpStatus } = require('../constants');

module.exports = {
  list: asyncHandler(async (req, res) => {
    const data = await couponService.list(req.query);
    res.status(httpStatus.OK).json({
      success: true,
      data: data.items,
      pagination: data.pagination,
    });
  }),

  get: asyncHandler(async (req, res) => {
    const data = await couponService.get(req.params.id);
    response.success(res, data);
  }),

  create: asyncHandler(async (req, res) => {
    const data = await couponService.create(req.body, req.user.sub);
    response.success(res, data, 'Coupon created successfully', httpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const data = await couponService.update(req.params.id, req.body);
    response.success(res, data, 'Coupon updated successfully');
  }),

  remove: asyncHandler(async (req, res) => {
    const data = await couponService.remove(req.params.id);
    response.success(res, data, 'Coupon deleted successfully');
  }),

  archive: asyncHandler(async (req, res) => {
    const data = await couponService.archive(req.params.id);
    response.success(res, data, 'Coupon archived successfully');
  }),

  validateCoupon: asyncHandler(async (req, res) => {
    const data = await couponService.validateCoupon(req.body);
    response.success(res, data);
  }),
};
