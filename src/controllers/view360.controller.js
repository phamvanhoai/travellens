const createController = require('./base.controller');
const view360Service = require('../services/view360.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const { httpStatus } = require('../constants');

module.exports = {
  ...createController(view360Service),

  listByLocation: asyncHandler(async (req, res) => {
    const data = await view360Service.listByLocation(req.params.locationId);
    response.success(res, data);
  }),

  createForLocation: asyncHandler(async (req, res) => {
    const data = await view360Service.createForLocation(req.params.locationId, req.body);
    response.success(res, data, 'View360 created successfully', httpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const data = await view360Service.update(req.params.viewId || req.params.id, req.body);
    response.success(res, data, 'View360 updated successfully');
  }),

  remove: asyncHandler(async (req, res) => {
    const data = await view360Service.remove(req.params.viewId || req.params.id);
    response.success(res, data, 'View360 deleted successfully');
  }),
};

