const createController = require('./base.controller');
const blogService = require('../services/blog.service');
const baseController = createController(blogService);

baseController.list = async (req, res, next) => {

  try {

    const result = await blogService.list(req.query);

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