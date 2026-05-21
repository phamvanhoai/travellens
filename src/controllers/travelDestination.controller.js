const travelDestinationService = require('../services/travelDestination.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const { httpStatus } = require('../constants');

module.exports = {
  list: asyncHandler(async (req, res) => {
    const data = await travelDestinationService.list(req.query);
    res.status(httpStatus.OK).json({
      success: true,
      data: data.items,
      pagination: data.pagination,
    });
  }),

  get: asyncHandler(async (req, res) => {
    const data = await travelDestinationService.get(req.params.id);
    response.success(res, data);
  }),

  create: asyncHandler(async (req, res) => {
    const data = await travelDestinationService.create(req.body);
    response.success(res, data, 'Travel destination created successfully', httpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const data = await travelDestinationService.update(req.params.id, req.body);
    response.success(res, data, 'Updated successfully');
  }),

  remove: asyncHandler(async (req, res) => {
    const data = await travelDestinationService.remove(req.params.id);
    response.success(res, data, 'Deleted successfully');
  }),
};

