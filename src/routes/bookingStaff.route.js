const express = require('express');
const controller = require('../controllers/booking.controller');
const validate = require('../middlewares/validate.middleware');
const { common, entity } = require('../validators');

const router = express.Router();

router
  .route('/')
  .get(validate({ query: common.paginationQuery }), controller.list)
  .post(validate({ body: entity.booking }), controller.create);

router
  .route('/:id')
  .get(validate({ params: common.idParam }), controller.get);

router.patch('/:id/cancel', validate({ params: common.idParam }), controller.cancel);

module.exports = router;
