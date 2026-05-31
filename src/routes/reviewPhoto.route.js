const express = require('express');
const controller = require('../controllers/reviewPhoto.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { handleReviewPhotoUpload } = require('../middlewares/upload.middleware');
const { reviewPhoto } = require('../validators');

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /reviews/{reviewId}/photos:
 *   post:
 *     summary: Upload photos for a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [photos]
 *             properties:
 *               photos:
 *                 type: array
 *                 maxItems: 5
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Review photos uploaded successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review Not Found
 *       413:
 *         description: File Too Large
 *       415:
 *         description: Unsupported Media Type
 */
router.post(
  '/',
  authenticate,
  validate(reviewPhoto.uploadForReview),
  handleReviewPhotoUpload,
  controller.uploadForReview
);

module.exports = router;
