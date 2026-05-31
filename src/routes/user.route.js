const express = require('express');
const controller = require('../controllers/user.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { common, user } = require('../validators');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router
  .route('/')
  .get(validate(user.list), controller.list)
  .post(validate(user.create), controller.create);

router
  .route('/:id')
  .get(validate({ params: common.idParam }), controller.get)
  .put(validate(user.update), controller.update)
  .delete(validate({ params: common.idParam }), controller.remove);

module.exports = router;
