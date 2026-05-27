const express = require('express');
const controller = require('../controllers/navigation.controller');
const validate = require('../middlewares/validate.middleware');
const { navigation } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * /navigation/routes/{tourId}:
 *   get:
 *     summary: Get tour navigation route
 *     description: Returns ordered tour destinations, coordinates, route polyline points, and step-by-step itinerary data.
 *     tags: [Navigation]
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Navigation route
 *       404:
 *         description: Tour Not Found
 */
router.get('/routes/:tourId', validate(navigation.route), controller.getRoute);

module.exports = router;
