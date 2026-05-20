const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate, authorize('staff', 'admin'));

/**
 * @swagger
 * tags:
 *   - name: Staff
 *     description: Staff endpoints. All endpoints require Bearer token with role `staff` or `admin`.
 *
 * /staff/reviews:
 *   get:
 *     summary: View review list
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Review list
 *
 * /staff/reviews/{id}:
 *   delete:
 *     summary: Delete review
 *     tags: [Staff]
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
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Coupon list
 *   post:
 *     summary: Create coupon
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Coupon created
 *
 * /staff/bookings:
 *   get:
 *     summary: View booking tour
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booking list
 *   post:
 *     summary: Create booking tour
 *     tags: [Staff]
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
router.use('/payments', require('./payment.route'));

module.exports = router;

