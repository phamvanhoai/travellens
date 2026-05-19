const suggestionService = require('../services/suggestion.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');

module.exports = {
  suggest: asyncHandler(async (req, res) => {
    const data = await suggestionService.suggest(req.body);
    response.success(res, data);
  }),
};

