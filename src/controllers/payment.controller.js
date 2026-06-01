const paymentService = require('../services/payment.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const { httpStatus } = require('../constants');

module.exports = {
  list: asyncHandler(async (req, res) => {
    const data = await paymentService.list(req.query);
    response.success(res, data);
  }),

  get: asyncHandler(async (req, res) => {
    const data = await paymentService.get(req.params.id);
    response.success(res, data);
  }),

  create: asyncHandler(async (req, res) => {
    const data = await paymentService.createForCustomer(req.body, req.user.sub);
    response.success(res, data, 'Payment created successfully', httpStatus.CREATED);
  }),

  getOwned: asyncHandler(async (req, res) => {
    const data = await paymentService.getOwned(req.params.id, req.user.sub);
    response.success(res, data);
  }),

  getOwnedStatus: asyncHandler(async (req, res) => {
    const data = await paymentService.getOwnedStatus(req.params.id, req.user.sub);
    response.success(res, data);
  }),

  refund: asyncHandler(async (req, res) => {
    const data = await paymentService.refund(req.params.id, req.body);
    response.success(res, data, 'Payment refunded');
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const data = await paymentService.updateStatus(req.params.id, req.body.status);
    response.success(res, data, 'Payment status updated');
  }),
};
