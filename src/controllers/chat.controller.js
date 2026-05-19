const chatService = require('../services/chat.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');

module.exports = {
  reply: asyncHandler(async (req, res) => {
    const data = await chatService.reply(req.body);
    response.success(res, data);
  }),
};

