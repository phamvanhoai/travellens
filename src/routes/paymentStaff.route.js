const express = require('express');
const controller = require('../controllers/payment.controller');
const validate = require('../middlewares/validate.middleware');
const { payment } = require('../validators');

const router = express.Router();

router.get('/', validate(payment.list), controller.list);
router.get('/:id', validate(payment.idParam), controller.get);
router.patch('/:id/refund', validate(payment.refund), controller.refund);
router.patch('/:id/status', validate(payment.updateStatus), controller.updateStatus);

module.exports = router;
