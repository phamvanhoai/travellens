const createController = require('./base.controller');
const tourService = require('../services/tour.service');
const asyncHandler = require('../utils/asyncHandler');
const { httpStatus } = require('../constants');

const baseController = createController(tourService);

module.exports = {
  ...baseController,
  create: asyncHandler(async (req, res) => {
    const data = await tourService.create(req.body);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'Tour created successfully',
      data,
    });
  }),
  update: asyncHandler(async (req, res) => {
    await tourService.update(req.params.id, req.body);
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Tour updated successfully',
    });
  }),
  remove: asyncHandler(async (req, res) => {
    await tourService.remove(req.params.id);
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Tour deleted successfully',
    });
  }),
  viewTourList: asyncHandler(async (req, res) => {
    const data = await tourService.viewTourList(req.query);
    res.status(httpStatus.OK).json({
      success: true,
      data: data.items,
      pagination: data.pagination,
    });
  }),
  viewTourDetail: asyncHandler(async (req, res) => {
    const data = await tourService.viewTourDetail(req.params.id);
    res.status(httpStatus.OK).json({
      success: true,
      data,
    });
  }),
  publicList: asyncHandler(async (req, res) => {
    const data = await tourService.publicList(req.query);
    res.status(httpStatus.OK).json({
      success: true,
      data: data.items,
      pagination: data.pagination,
    });
  }),
  publicDetail: asyncHandler(async (req, res) => {
    const data = await tourService.publicDetail(req.params.id);
    res.status(httpStatus.OK).json({
      success: true,
      data,
    });
  }),
};

