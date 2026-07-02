const express = require('express');
const controller = require('../controllers/booking.controller');
const reviewController = require('../controllers/review.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { common, entity, review } = require('../validators');

const router = express.Router();

router.use(authenticate, authorize('customer'));

/**
 * @swagger
 * /bookings/{bookingId}/review:
 *   post:
 *     summary: Submit a tour review from a booking
 *     description: The review is displayed on the related tour, but the booking proves the customer actually booked and paid for that tour. Each booking can be reviewed once.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 nullable: true
 *                 example: Tour rất tuyệt, hướng dẫn viên nhiệt tình.
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       400:
 *         description: Booking is not eligible for review
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 *       409:
 *         description: Booking has already been reviewed
 *   put:
 *     summary: Update current customer's tour review for a booking
 *     description: Updates the review attached to this booking. The booking must belong to the current customer.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 nullable: true
 *                 example: Updated tour review.
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Review does not belong to current customer
 *       404:
 *         description: Booking or review not found
 *   delete:
 *     summary: Delete current customer's tour review for a booking
 *     description: Soft deletes the review attached to this booking. The booking must belong to the current customer.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Review does not belong to current customer
 *       404:
 *         description: Booking or review not found
 */

router
  .route('/')
  .get(validate({ query: common.paginationQuery }), controller.customerList)
  .post(validate({ body: entity.booking }), controller.customerCreate);

router
  .route('/:id')
  .get(validate({ params: common.idParam }), controller.customerGet);

router.patch(
  '/:id/cancel',
  validate({ params: common.idParam, body: entity.bookingCancel }),
  controller.customerCancel
);

router
  .route('/:bookingId/review')
  .post(validate(review.submitBookingTourReview), reviewController.submitBookingTourReview)
  .put(validate(review.updateBookingTourReview), reviewController.updateBookingTourReview)
  .delete(validate(review.deleteBookingTourReview), reviewController.deleteBookingTourReview);

module.exports = router;
