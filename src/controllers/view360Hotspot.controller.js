const view360HotspotService = require('../services/view360Hotspot.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const { httpStatus } = require('../constants');

module.exports = {
  listPublicByView: asyncHandler(async (req, res) => {
    const data = await view360HotspotService.listPublicByView(req.params.view360Id);
    response.success(res, data);
  }),

  listByView: asyncHandler(async (req, res) => {
    const data = await view360HotspotService.listByView(req.params.view360Id);
    response.success(res, data);
  }),

  createForView: asyncHandler(async (req, res) => {
    const data = await view360HotspotService.createForView(req.params.view360Id, req.body);
    response.success(res, data, 'View360 hotspot created successfully', httpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const data = await view360HotspotService.update(req.params.hotspotId, req.body);
    response.success(res, data, 'View360 hotspot updated successfully');
  }),

  remove: asyncHandler(async (req, res) => {
    const data = await view360HotspotService.remove(req.params.hotspotId);
    response.success(res, data, 'View360 hotspot deleted successfully');
  }),
};
