const express = require('express');
const controller = require('../controllers/view360Image.controller');
const validate = require('../middlewares/validate.middleware');
const { common, view360Image } = require('../validators');

const router = express.Router();

router.get('/', validate(view360Image.list), controller.list);
router.get('/:id', validate({ params: common.idParam }), controller.get);

module.exports = router;
