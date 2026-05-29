const createController = require('./base.controller');
const tourService = require('../services/tour.service');

const baseController = createController(tourService);


// CUSTOM LIST
baseController.list = async (req, res, next) => {

  try {

    const result = await tourService.list(req.query);

    return res.json({
      success: true,
      message: 'Success',
      data: result,
    });

  } catch (error) {

    next(error);
  }
};

module.exports = baseController;
