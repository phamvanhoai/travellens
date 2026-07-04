const express = require('express');
const controller = require('../controllers/location.controller');
const reviewController = require('../controllers/review.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { common, location, review } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Locations
 *     description: Public read-only location endpoints
 *
 * /locations:
 *   get:
 *     summary: List locations
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: gate
 *       - in: query
 *         name: destination_id
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [location_id, name, created_at, updated_at]
 *           example: created_at
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: DESC
 *     responses:
 *       200:
 *         description: Location list with pagination
 *
 * /locations/{id}:
 *   get:
 *     summary: Get location detail
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Location detail
 *       404:
 *         description: Location not found
 *
 * /locations/{locationId}/reviews:
 *   post:
 *     summary: Submit a review for a location
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
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
 *                 maxLength: 1000
 *                 example: This location is very beautiful and worth visiting.
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Location Not Found
 *       409:
 *         description: Review Already Exists
 */
router.get('/', validate(location.list), controller.list);
router.post(
  '/:locationId/reviews',
  authenticate,
  authorize('customer'),
  validate(review.submitLocationReview),
  reviewController.submitLocationReview
);
router.get('/:id', validate({ params: common.idParam }), controller.get);

module.exports = router;
