const zaloBotService = require('../services/zaloBot.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');

module.exports = {
  handle: asyncHandler(async (req, res) => {
    const data = await zaloBotService.handleWebhook(req.body, req.headers);
    response.success(res, data, 'Zalo webhook processed successfully');
  }),
};
