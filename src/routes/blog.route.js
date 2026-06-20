const express = require('express');
const controller = require('../controllers/blog.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { common, entity } = require('../validators');

const router = express.Router();

router.get(
  '/',
  validate({ query: common.paginationQuery }),
  controller.list
);

router.post(
  '/',
  authenticate,
  validate({ body: entity.blog }),
  controller.create
);

router.get(
  '/:id',
  validate({ params: common.idParam }),
  controller.get
);

router.put(
  '/:id',
  authenticate,
  validate({ params: common.idParam, body: entity.blogUpdate }),
  controller.update
);

router.delete(
  '/:id',
  authenticate,
  validate({ params: common.idParam }),
  controller.remove
);

module.exports = router;
