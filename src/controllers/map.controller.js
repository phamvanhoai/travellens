const createController = require('./base.controller');
const mapService = require('../services/map.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const { httpStatus } = require('../constants');

module.exports = {
  ...createController(mapService),

  list: asyncHandler(async (req, res) => {
    const data = await mapService.list(req.query);
    res.status(httpStatus.OK).json({
      success: true,
      data: data.items,
      pagination: data.pagination,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const data = await mapService.create(req.body);
    response.success(res, data, 'Map created successfully', httpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const data = await mapService.update(req.params.id, req.body);
    response.success(res, data, 'Map updated successfully');
  }),

  remove: asyncHandler(async (req, res) => {
    const data = await mapService.remove(req.params.id);
    response.success(res, data, 'Map deleted successfully');
  }),
};

