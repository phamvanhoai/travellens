const express = require('express');
const controller = require('../controllers/nearby.controller');
const validate = require('../middlewares/validate.middleware');
const { nearby } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * /maps/nearby:
 *   get:
 *     summary: Suggest nearby travel destinations and locations
 *     description: Uses customer GPS coordinates to return nearby suggestions sorted by distance, View360 availability, popularity, and rating.
 *     tags: [Maps]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *           example: 10.7769
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *           example: 106.7009
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 5
 *           example: 5
 *     responses:
 *       200:
 *         description: Nearby suggestions
 */
router.get('/', validate(nearby.suggest), controller.suggest);

module.exports = router;
