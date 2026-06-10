const express = require('express');
const controller = require('../controllers/location.controller');
const validate = require('../middlewares/validate.middleware');
const { handleLocationThumbnailUpload } = require('../middlewares/upload.middleware');
const { common, location } = require('../validators');

const router = express.Router();

router
  .route('/')
  .get(validate(location.list), controller.list)
  .post(handleLocationThumbnailUpload, validate(location.create), controller.create);

router
  .route('/:id')
  .get(validate({ params: common.idParam }), controller.get)
  .put(handleLocationThumbnailUpload, validate(location.update), controller.update)
  .delete(validate({ params: common.idParam }), controller.remove);

module.exports = router;
