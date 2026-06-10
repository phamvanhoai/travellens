const express = require('express');
const controller = require('../controllers/tour.controller');
const validate = require('../middlewares/validate.middleware');
const { handleTourThumbnailUpload } = require('../middlewares/upload.middleware');
const { tour } = require('../validators');

const router = express.Router();

router
  .route('/')
  .get(validate(tour.list), controller.viewTourList)
  .post(handleTourThumbnailUpload, validate(tour.create), controller.create);

router
  .route('/:id')
  .get(validate(tour.detail), controller.viewTourDetail)
  .put(handleTourThumbnailUpload, validate(tour.update), controller.update)
  .delete(validate(tour.remove), controller.remove);

module.exports = router;
