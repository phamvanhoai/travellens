const express = require('express');
const controller = require('../controllers/refundRequest.controller');
const validate = require('../middlewares/validate.middleware');
const { refundRequest } = require('../validators');

const router = express.Router();

router.get('/', validate(refundRequest.list), controller.list);
router.patch('/:id/complete', validate(refundRequest.complete), controller.complete);

module.exports = router;
