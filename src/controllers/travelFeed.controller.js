const travelFeedService = require('../services/travelFeed.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');

const list = asyncHandler(async (req, res) => {
  const result = await travelFeedService.list(req.user.sub, req.query);
  response.success(res, result, 'Travel feed retrieved successfully');
});

const create = asyncHandler(async (req, res) => {
  const result = await travelFeedService.create(req.user.sub, req.body, req.files || []);
  response.success(res, result, 'Travel post created successfully', 201);
});

module.exports = {
  list,
  create,
};
