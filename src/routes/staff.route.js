const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate, authorize('staff', 'admin'));

/**
 * @swagger
 * tags:
 *   - name: Staff Coupons
 *     description: Staff coupon management endpoints. Requires Bearer token with role `staff` or `admin`.
 *   - name: Staff Bookings
 *     description: Staff booking management endpoints. Requires Bearer token with role `staff` or `admin`.
 *   - name: Staff Reviews
 *     description: Staff review moderation endpoints. Requires Bearer token with role `staff` or `admin`.
 *   - name: Staff Payments
 *     description: Staff payment management endpoints. Requires Bearer token with role `staff` or `admin`.
 *
 * /staff/reviews:
 *   get:
 *     summary: View review list
 *     tags: [Staff Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Review list
 *
 * /staff/reviews/{id}:
 *   delete:
 *     summary: Delete review
 *     tags: [Staff Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review deleted
 *
 * /staff/coupons:
 *   get:
 *     summary: List coupons
 *     tags: [Staff Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: SUMMER
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, expired, deleted]
 *       - in: query
 *         name: discount_type
 *         schema:
 *           type: string
 *           enum: [percentage, fixed]
 *     responses:
 *       200:
 *         description: Coupon list
 *   post:
 *     summary: Create coupon
 *     tags: [Staff Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, discount_type, discount_value, usage_limit, start_date, end_date]
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUMMER20
 *               name:
 *                 type: string
 *                 example: Summer Discount
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: 20% discount for summer tours
 *               discount_type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: percentage
 *               discount_value:
 *                 type: number
 *                 example: 20
 *               max_discount_amount:
 *                 type: number
 *                 nullable: true
 *                 example: 100000
 *               min_order_amount:
 *                 type: number
 *                 example: 500000
 *               usage_limit:
 *                 type: integer
 *                 example: 100
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-30"
 *               status:
 *                 type: string
 *                 enum: [active, inactive, expired]
 *                 example: active
 *     responses:
 *       201:
 *         description: Coupon created
 *       409:
 *         description: Duplicate coupon code
 *
 * /staff/coupons/{id}:
 *   get:
 *     summary: Get coupon detail
 *     tags: [Staff Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Coupon detail
 *   put:
 *     summary: Update coupon
 *     tags: [Staff Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Summer Discount Updated
 *               description:
 *                 type: string
 *                 nullable: true
 *               discount_type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               discount_value:
 *                 type: number
 *                 example: 15
 *               max_discount_amount:
 *                 type: number
 *                 nullable: true
 *               min_order_amount:
 *                 type: number
 *               usage_limit:
 *                 type: integer
 *                 example: 150
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [active, inactive, expired]
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       404:
 *         description: Coupon not found
 *   delete:
 *     summary: Delete coupon
 *     tags: [Staff Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *       404:
 *         description: Coupon not found
 *
 * /staff/bookings:
 *   get:
 *     summary: View booking tour
 *     tags: [Staff Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booking list
 *   post:
 *     summary: Create booking tour
 *     tags: [Staff Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Booking created
 */
router.use('/reviews', require('./review.route'));
router.use('/coupons', require('./coupon.route'));
router.use('/bookings', require('./booking.route'));
router.use('/booking-details', require('./bookingDetail.route'));
router.use('/payments', require('./paymentStaff.route'));

module.exports = router;
