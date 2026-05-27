const express = require('express');
const controller = require('../controllers/mapFilter.controller');
const validate = require('../middlewares/validate.middleware');
const { mapFilter } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * /maps/filter:
 *   get:
 *     summary: Filter location and destination map markers
 *     tags: [Maps]
 *     parameters:
 *       - in: query
 *         name: destination_category_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: has_view360
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: min_rating
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         description: Radius in kilometers. Requires lat and lng.
 *         schema:
 *           type: number
 *       - in: query
 *         name: nearby_only
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: popular_only
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Filtered map markers
 */
router.get('/', validate(mapFilter.filter), controller.filter);

module.exports = router;
