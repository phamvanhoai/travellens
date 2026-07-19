const service = require('../services/travelStory.service');
const asyncHandler = require('../utils/asyncHandler');
const { httpStatus } = require('../constants');

module.exports = {
  list: asyncHandler(async (req, res) => {
    const result = await service.list(req.user.sub, req.user.role, req.query);
    res.json({ success: true, message: 'Travel stories retrieved successfully', data: result.items, pagination: result.pagination });
  }),
  mine: asyncHandler(async (req, res) => {
    const result = await service.listMine(req.user.sub, req.query);
    res.json({ success: true, message: 'Own travel stories retrieved successfully', data: result.items, pagination: result.pagination });
  }),
  get: asyncHandler(async (req, res) => res.json({
    success: true,
    data: await service.get(req.params.id, req.user.sub, req.user.role),
  })),
  create: asyncHandler(async (req, res) => res.status(httpStatus.CREATED).json({
    success: true, message: 'Travel story created successfully', data: await service.create(req.user.sub, req.body),
  })),
  view: asyncHandler(async (req, res) => res.json({
    success: true, message: 'Travel story viewed', data: await service.view(req.params.id, req.user.sub),
  })),
  viewers: asyncHandler(async (req, res) => {
    const result = await service.viewers(req.params.id, req.user.sub, req.query);
    res.json({ success: true, data: result.items, pagination: result.pagination });
  }),
  remove: asyncHandler(async (req, res) => res.json({
    success: true, message: 'Travel story deleted successfully', data: await service.remove(req.params.id, req.user.sub),
  })),
};
