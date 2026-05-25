const createController = require('./base.controller');
const locationService = require('../services/location.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const { httpStatus } = require('../constants');

module.exports = {
  ...createController(locationService),

  list: asyncHandler(async (req, res) => {
    const data = await locationService.list(req.query);
    res.status(httpStatus.OK).json({
      success: true,
      data: data.items,
      pagination: data.pagination,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const data = await locationService.create(req.body);
    response.success(res, data, 'Location created successfully', httpStatus.CREATED);
  }),
};
