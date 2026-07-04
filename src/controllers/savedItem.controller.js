const savedItemService = require('../services/savedItem.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');

const toggleTour = asyncHandler(async (req, res) => {
  const result = await savedItemService.toggleTour(req.user.sub, req.params.id);
  response.success(res, result, result.saved ? 'Tour saved successfully' : 'Tour unsaved successfully');
});

const toggleDestination = asyncHandler(async (req, res) => {
  const result = await savedItemService.toggleDestination(req.user.sub, req.params.id);
  response.success(res, result, result.saved ? 'Destination saved successfully' : 'Destination unsaved successfully');
});

const listTours = asyncHandler(async (req, res) => {
  const result = await savedItemService.listTours(req.user.sub, req.query);
  response.success(res, result, 'Saved tours retrieved successfully');
});

const listDestinations = asyncHandler(async (req, res) => {
  const result = await savedItemService.listDestinations(req.user.sub, req.query);
  response.success(res, result, 'Saved destinations retrieved successfully');
});

const getSavedIds = asyncHandler(async (req, res) => {
  const result = await savedItemService.getSavedIds(req.user.sub);
  response.success(res, result, 'Saved IDs retrieved successfully');
});

module.exports = {
  toggleTour,
  toggleDestination,
  listTours,
  listDestinations,
  getSavedIds
};
