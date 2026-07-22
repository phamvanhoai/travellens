const asyncHandler = require('../utils/asyncHandler');
const service = require('../services/tourDeparture.service');
const response = require('../utils/responseHandler');

module.exports = {
  publicList: asyncHandler(async (req, res) => response.success(res, await service.listPublic(req.params.id))),
  adminList: asyncHandler(async (req, res) => { const result = await service.listAdmin(req.params.tourId, req.query); res.json({ success: true, message: 'Success', data: result.items, pagination: result.pagination }); }),
  create: asyncHandler(async (req, res) => response.success(res, await service.create(req.params.tourId, req.body), 'Tour departure created', 201)),
  bulkCreate: asyncHandler(async (req, res) => response.success(res, await service.bulkCreate(req.params.tourId, req.body), 'Tour departures generated', 201)),
  update: asyncHandler(async (req, res) => response.success(res, await service.update(req.params.tourId, req.params.departureId, req.body), 'Tour departure updated')),
  remove: asyncHandler(async (req, res) => response.success(res, await service.remove(req.params.tourId, req.params.departureId), 'Tour departure deleted')),
};
