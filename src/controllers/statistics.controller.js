const createController = require('./base.controller');
const statisticsService = require('../services/statistics.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');

module.exports = {
  ...createController(statisticsService),
  dashboard: asyncHandler(async (req, res) => {
    const data = await statisticsService.dashboard();
    response.success(res, data);
  }),

  users: asyncHandler(async (req, res) => {
    const data = await statisticsService.userStats();
    response.success(res, data);
  }),

  locations: asyncHandler(async (req, res) => {
    const data = await statisticsService.locationStats();
    response.success(res, data);
  }),

  content: asyncHandler(async (req, res) => {
    const data = await statisticsService.contentStats();
    response.success(res, data);
  }),
};
