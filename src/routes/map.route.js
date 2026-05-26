const express = require('express');
const validate = require('../middlewares/validate.middleware');
const { handleMapUpload } = require('../middlewares/upload.middleware');
const controller = require('../controllers/map.controller');
const { common, entity, map } = require('../validators');

const router = express.Router();

router
  .route('/')
  .get(validate(map.list), controller.list)
  .post(handleMapUpload, validate({ body: entity.map }), controller.create);

router
  .route('/:id')
  .get(validate({ params: common.idParam }), controller.get)
  .put(handleMapUpload, validate(map.update), controller.update)
  .delete(validate({ params: common.idParam }), controller.remove);

module.exports = router;

