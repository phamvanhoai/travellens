const express = require('express');
const controller = require('../controllers/review.controller');
const validate = require('../middlewares/validate.middleware');
const { common } = require('../validators');

const router = express.Router();

router.get('/', validate({ query: common.paginationQuery }), controller.list);
router.get('/:id', validate({ params: common.idParam }), controller.get);
router.use('/:reviewId/photos', require('./reviewPhoto.route'));

module.exports = router;
