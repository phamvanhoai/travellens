const express = require('express');
const controller = require('../controllers/booking.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { common, entity } = require('../validators');

const router = express.Router();

router.use(authenticate, authorize('customer'));

router
  .route('/')
  .get(validate({ query: common.paginationQuery }), controller.customerList)
  .post(validate({ body: entity.booking }), controller.customerCreate);

router
  .route('/:id')
  .get(validate({ params: common.idParam }), controller.customerGet)
  .put(validate({ params: common.idParam }), controller.customerUpdate)
  .delete(validate({ params: common.idParam }), controller.customerRemove);

router.patch('/:id/cancel', validate({ params: common.idParam }), controller.customerCancel);

module.exports = router;
