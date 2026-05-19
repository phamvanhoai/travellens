const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const { httpStatus, messages } = require('../constants');

module.exports = (service) => ({
  list: asyncHandler(async (req, res) => {
    const data = await service.list(req.query);
    response.success(res, data);
  }),

  get: asyncHandler(async (req, res) => {
    const data = await service.get(req.params.id);
    response.success(res, data);
  }),

  create: asyncHandler(async (req, res) => {
    const data = await service.create(req.body);
    response.success(res, data, messages.CREATED, httpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const data = await service.update(req.params.id, req.body);
    response.success(res, data, messages.UPDATED);
  }),

  remove: asyncHandler(async (req, res) => {
    const data = await service.remove(req.params.id);
    response.success(res, data, messages.DELETED);
  }),
});

