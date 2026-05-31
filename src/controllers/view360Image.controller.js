const createController = require('./base.controller');
const view360ImageService = require('../services/view360Image.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const { httpStatus } = require('../constants');

module.exports = {
  ...createController(view360ImageService),

  listByView: asyncHandler(async (req, res) => {
    const data = await view360ImageService.listByView(req.params.viewId);
    response.success(res, data);
  }),

  createForView: asyncHandler(async (req, res) => {
    const data = await view360ImageService.createForView(req.params.viewId, req.body);
    response.success(res, data, 'View360 image created successfully', httpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const data = await view360ImageService.update(req.params.imageId || req.params.id, req.body);
    response.success(res, data, 'View360 image updated successfully');
  }),

  remove: asyncHandler(async (req, res) => {
    const data = await view360ImageService.remove(req.params.imageId || req.params.id);
    response.success(res, data, 'View360 image deleted successfully');
  }),
};

