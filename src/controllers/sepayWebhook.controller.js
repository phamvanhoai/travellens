const sepayWebhookService = require('../services/sepayWebhook.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');

module.exports = {
  handle: asyncHandler(async (req, res) => {
    const data = await sepayWebhookService.process(req.body, req.headers);
    response.success(res, data, 'Webhook processed successfully');
  }),
};
