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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     location_id:
 *                       type: integer
 *                       example: 7
 *                     name:
 *                       type: string
 *                       example: Main Hall
 *                     latitude:
 *                       type: number
 *                       nullable: true
 *                     longitude:
 *                       type: number
 *                       nullable: true
 *                     description:
 *                       type: string
 *                       nullable: true
 *                     thumbnail:
 *                       type: string
 *                       nullable: true
 *                     travel_destination_id:
 *                       type: integer
 *                     travel_destination_name:
 *                       type: string
 *                       nullable: true
 *                     maps:
 *                       type: array
 *                       items:
 *                         type: object
 *                     view360:
 *                       type: array
 *                       items:
 *                         type: object
 *                     view360s:
 *                       type: array
 *                       items:
 *                         type: object
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: Location not found
 *
 * /locations/{id}/weather:
 *   get:
 *     summary: Get current weather for a location
 *     description: Uses the location latitude and longitude to fetch current weather from Open-Meteo. The backend caches responses briefly to avoid calling the provider on every request.
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Current weather for the location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     location_id:
 *                       type: integer
 *                       example: 7
 *                     location_name:
 *                       type: string
 *                       example: Main Hall
 *                     latitude:
 *                       type: number
 *                       example: 10.777035
 *                     longitude:
 *                       type: number
 *                       example: 106.695523
 *                     weather:
 *                       type: object
 *                       properties:
 *                         provider: { type: string, example: open-meteo }
 *                         temperature: { type: number, example: 31 }
 *                         feels_like: { type: number, example: 35 }
 *                         humidity: { type: number, example: 74 }
 *                         precipitation: { type: number, example: 0 }
 *                         wind_speed: { type: number, example: 9 }
 *                         weather_code: { type: integer, example: 3 }
 *                         condition: { type: string, example: Overcast }
 *                         cached: { type: boolean, example: false }
 *                         updated_at: { type: string, example: "2026-07-02T09:00" }
 *       400:
 *         description: Location coordinates are missing or weather provider failed
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
 *
 * /locations/{locationId}/reviews/{reviewId}:
 *   put:
 *     summary: Update current customer's location review
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: reviewId
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
 *                 maxLength: 1000
 *                 nullable: true
 *                 example: Updated review content.
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Review does not belong to current customer
 *       404:
 *         description: Location or review not found
 *   delete:
 *     summary: Delete current customer's location review
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: reviewId
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
 *         description: Location or review not found
 */
router.get('/', validate(location.list), controller.list);
router.get('/:id/weather', validate({ params: common.idParam }), controller.weather);
router.post(
  '/:locationId/reviews',
  authenticate,
  authorize('customer'),
  validate(review.submitLocationReview),
  reviewController.submitLocationReview
);
router.put(
  '/:locationId/reviews/:reviewId',
  authenticate,
  authorize('customer'),
  validate(review.updateLocationReview),
  reviewController.updateLocationReview
);
router.delete(
  '/:locationId/reviews/:reviewId',
  authenticate,
  authorize('customer'),
  validate(review.deleteLocationReview),
  reviewController.deleteLocationReview
);
router.get('/:id', validate({ params: common.idParam }), controller.get);

module.exports = router;
