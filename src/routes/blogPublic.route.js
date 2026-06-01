const express = require('express');
const controller = require('../controllers/blog.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { common, entity } = require('../validators');

const router = express.Router();

router.get('/', validate({ query: common.paginationQuery }), controller.list);
router.get('/:id', validate({ params: common.idParam }), controller.get);
router.post('/', authenticate, authorize('customer'), validate({ body: entity.blog }), controller.create);
router.put('/:id', authenticate, authorize('customer'), validate({ params: common.idParam }), controller.update);
router.delete('/:id', authenticate, authorize('customer'), validate({ params: common.idParam }), controller.remove);

module.exports = router;
