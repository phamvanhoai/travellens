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


baseController.create = async (req, res, next) => {
  try {
    console.log('CREATE USER:', req.user);

    const result = await blogService.create(
      req.body,
      req.user.sub
    );

    return res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: result,
    });

  } catch (error) {
    next(error);
  }
};

baseController.update = async (req, res, next) => {
  try {
    console.log('UPDATE USER:', req.user);

    const result = await blogService.update(
      req.params.id,
      req.body,
      req.user
    );

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    next(error);
  }
};

baseController.remove = async (req, res, next) => {
  try {

    const result = await blogService.remove(
      req.params.id,
      req.user
    );

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = baseController;
