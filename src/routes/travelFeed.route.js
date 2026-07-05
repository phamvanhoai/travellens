const express = require('express');
const controller = require('../controllers/travelFeed.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { handleTravelPostPhotoUpload } = require('../middlewares/upload.middleware');
const { travelFeed } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * /travel-feed:
 *   get:
 *     summary: View Travel Feed
 *     description: Customer views published public travel posts with author, photos, location, destination, counts, and current like state.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: destination_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: location_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, popular]
 *           default: newest
 *     responses:
 *       200:
 *         description: Travel feed list with pagination
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required
 */
router.get(
  '/',
  authenticate,
  authorize('customer'),
  validate(travelFeed.list),
  controller.list
);

/**
 * @swagger
 * /travel-feed:
 *   post:
 *     summary: Create Post
 *     description: Customer creates a public travel feed post. Send photos as multipart field `photos`.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 5000
 *               destination_id:
 *                 type: integer
 *               location_id:
 *                 type: integer
 *               photos:
 *                 type: array
 *                 maxItems: 10
 *                 items:
 *                   type: string
 *                   format: binary
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 5000
 *               destination_id:
 *                 type: integer
 *               location_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Travel post created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required
 *       404:
 *         description: Destination or location not found
 */
router.post(
  '/',
  authenticate,
  authorize('customer'),
  handleTravelPostPhotoUpload,
  validate(travelFeed.create),
  controller.create
);

module.exports = router;
