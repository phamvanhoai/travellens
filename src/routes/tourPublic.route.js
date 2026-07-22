const express = require('express');
const controller = require('../controllers/tour.controller');
const reviewController = require('../controllers/review.controller');
const validate = require('../middlewares/validate.middleware');
const { review, tour } = require('../validators');
const tourDepartureController = require('../controllers/tourDeparture.controller');
const tourDepartureValidator = require('../validators/tourDeparture.validator');

const router = express.Router();

/**
 * @swagger
 * /tours/{tourId}/reviews:
 *   get:
 *     summary: List reviews displayed on a tour
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *     responses:
 *       200:
 *         description: Approved review list for the tour
 */
router.get('/', validate(tour.list), controller.publicList);
router.get('/:id/availability', validate(tour.availability), controller.publicAvailability);
router.get('/:id/departures', validate(tourDepartureValidator.publicList), tourDepartureController.publicList);
router.get(
  '/:tourId/reviews',
  validate(review.tourReviews),
  reviewController.listTourReviews
);
router.get('/:id', validate(tour.detail), controller.publicDetail);

module.exports = router;
