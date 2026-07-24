const express = require('express');
const controller = require('../controllers/travelDestination.controller');
const validate = require('../middlewares/validate.middleware');
const { handleTravelDestinationThumbnailUpload } = require('../middlewares/upload.middleware');
const { common, entity } = require('../validators');

const router = express.Router();

const normalizeNullableFields = (req, res, next) => {
  for (const field of ['latitude', 'longitude', 'destination_category_id']) {
    if (req.body?.[field] === '') req.body[field] = null;
  }
  next();
};

router
  .route('/')
  .get(validate({ query: common.paginationQuery }), controller.list)
  .post(handleTravelDestinationThumbnailUpload, normalizeNullableFields, validate({ body: entity.travelDestination }), controller.create);

router
  .route('/:id')
  .get(validate({ params: common.idParam }), controller.get)
  .put(handleTravelDestinationThumbnailUpload, normalizeNullableFields, validate({ params: common.idParam }), controller.update)
  .delete(validate({ params: common.idParam }), controller.remove);

module.exports = router;
