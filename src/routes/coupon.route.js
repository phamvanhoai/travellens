const express = require('express');
const controller = require('../controllers/coupon.controller');
const validate = require('../middlewares/validate.middleware');
const { coupon } = require('../validators');

const router = express.Router();

router.get('/', validate(coupon.list), controller.list);
router.post('/', validate(coupon.create), controller.create);
router.get('/:id', validate(coupon.idParam), controller.get);
router.put('/:id', validate(coupon.update), controller.update);
router.delete('/:id', validate(coupon.idParam), controller.remove);

module.exports = router;

