const express = require('express');
const controller = require('../controllers/location.controller');
const validate = require('../middlewares/validate.middleware');
const { handleLocationThumbnailUpload } = require('../middlewares/upload.middleware');
const { common, location } = require('../validators');

const router = express.Router();

const normalizeOptionalCoordinates = (req, res, next) => {
  for (const field of ['latitude', 'longitude']) {
    if (req.body?.[field] === '') {
      req.body[field] = null;
    }
  }
  next();
};

router
  .route('/')
  .get(validate(location.list), controller.list)
  .post(
    handleLocationThumbnailUpload,
    normalizeOptionalCoordinates,
    validate(location.create),
    controller.create
  );

router
  .route('/:id')
  .get(validate({ params: common.idParam }), controller.get)
  .put(
    handleLocationThumbnailUpload,
    normalizeOptionalCoordinates,
    validate(location.update),
    controller.update
  )
  .delete(validate({ params: common.idParam }), controller.remove);

module.exports = router;
