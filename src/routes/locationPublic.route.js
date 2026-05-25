const express = require('express');
const controller = require('../controllers/location.controller');
const validate = require('../middlewares/validate.middleware');
const { common, location } = require('../validators');

const router = express.Router();

router.get('/', validate(location.list), controller.list);
router.get('/:id', validate({ params: common.idParam }), controller.get);

module.exports = router;
