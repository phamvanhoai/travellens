const express = require('express');
const controller = require('../controllers/view360Image.controller');
const validate = require('../middlewares/validate.middleware');
const { common } = require('../validators');

const router = express.Router();

router.get('/', validate({ query: common.paginationQuery }), controller.list);
router.get('/:id', validate({ params: common.idParam }), controller.get);

module.exports = router;
