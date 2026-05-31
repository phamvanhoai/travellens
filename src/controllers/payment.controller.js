const createController = require('./base.controller');
const paymentService = require('../services/payment.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');

module.exports = {
  ...createController(paymentService),
  refund: asyncHandler(async (req, res) => {
    const data = await paymentService.refund(req.params.id, req.body);
    response.success(res, data, 'Payment refunded');
  }),

  updateStatus: asyncHandler(async (req, res) => {

    const data = await paymentService.updateStatus(
      req.params.id,
      req.body.status
    );

    response.success(
      res,
      data,
      'Payment status updated'
    );
  }),
};


