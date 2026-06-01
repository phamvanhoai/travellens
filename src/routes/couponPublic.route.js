const express = require('express');
const controller = require('../controllers/coupon.controller');
const validate = require('../middlewares/validate.middleware');
const { coupon } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Coupons
 *     description: Customer coupon validation
 *
 * /coupons/validate:
 *   post:
 *     summary: Validate coupon for booking
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, booking_amount]
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUMMER20
 *               booking_amount:
 *                 type: number
 *                 example: 700000
 *     responses:
 *       200:
 *         description: Coupon validation result
 *       400:
 *         description: Coupon cannot be applied
 *       404:
 *         description: Coupon not found
 */
router.post('/validate', validate(coupon.validateCoupon), controller.validateCoupon);

module.exports = router;
