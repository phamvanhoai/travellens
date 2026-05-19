const express = require('express');
const validate = require('../middlewares/validate.middleware');
const { common } = require('../validators');

module.exports = (controller, createSchema) => {
  const router = express.Router();

  const rootRoute = router.route('/');
  rootRoute.get(validate({ query: common.paginationQuery }), controller.list);
  if (createSchema) {
    rootRoute.post(validate({ body: createSchema }), controller.create);
  } else {
    rootRoute.post(controller.create);
  }

  router
    .route('/:id')
    .get(validate({ params: common.idParam }), controller.get)
    .put(validate({ params: common.idParam }), controller.update)
    .delete(validate({ params: common.idParam }), controller.remove);

  return router;
};
