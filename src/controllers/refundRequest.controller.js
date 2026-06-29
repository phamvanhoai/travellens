const refundRequestService = require('../services/refundRequest.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');

module.exports = {
  list: asyncHandler(async (req, res) => {
    const data = await refundRequestService.list(req.query);
    response.success(res, data);
  }),

  complete: asyncHandler(async (req, res) => {
    const data = await refundRequestService.complete(req.params.id, req.body, req.user.sub);
    response.success(res, data, 'Refund completed');
  }),
};
