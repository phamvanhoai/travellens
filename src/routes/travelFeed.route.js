const express = require('express');
const controller = require('../controllers/travelFeed.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, optionalAuthenticate, authorize } = require('../middlewares/auth.middleware');
const { handleTravelPostPhotoUpload } = require('../middlewares/upload.middleware');
const { travelFeed } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * /travel-feed/{postId}/share-preview:
 *   get:
 *     summary: Public Share Preview
 *     description: Public HTML preview with Open Graph tags for Facebook, Zalo, and other crawlers. Browsers are redirected to the frontend post page.
 *     tags: [Travel Feed]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: HTML share preview
 *       404:
 *         description: Travel post not found
 */
router.get(
  '/:postId/share-preview',
  validate(travelFeed.postAction),
  controller.sharePreview
);

/**
 * @swagger
 * /travel-feed/blocked-users:
 *   get:
 *     summary: List Blocked Users
 *     description: Customer lists users they have blocked for the privacy settings screen.
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
 *           default: 20
 *     responses:
 *       200:
 *         description: Blocked users retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required
 */
router.get(
  '/blocked-users',
  authenticate,
  authorize('customer'),
  validate(travelFeed.listBlockedUsers),
  controller.listBlockedUsers
);

/**
 * @swagger
 * /travel-feed/users/{userId}/block:
 *   post:
 *     summary: Block User
 *     description: Customer blocks another active customer. Blocked users are hidden from each other and cannot interact in Travel Feed.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User blocked successfully
 *       400:
 *         description: Cannot block yourself
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required
 *       404:
 *         description: Customer not found
 */
router.post(
  '/users/:userId/block',
  authenticate,
  authorize('customer'),
  validate(travelFeed.userAction),
  controller.blockUser
);

/**
 * @swagger
 * /travel-feed/users/{userId}/block:
 *   delete:
 *     summary: Unblock User
 *     description: Customer removes their block for another customer.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User unblocked successfully
 *       400:
 *         description: Cannot unblock yourself
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required
 *       404:
 *         description: Customer not found
 */
router.delete(
  '/users/:userId/block',
  authenticate,
  authorize('customer'),
  validate(travelFeed.userAction),
  controller.unblockUser
);

/**
 * @swagger
 * /travel-feed/users/{userId}/block-status:
 *   get:
 *     summary: Get Block Status
 *     description: Customer checks whether they blocked another customer or were blocked by them.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Block status retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required
 *       404:
 *         description: Customer not found
 */
router.get(
  '/users/:userId/block-status',
  authenticate,
  authorize('customer'),
  validate(travelFeed.userAction),
  controller.getBlockStatus
);

/**
 * @swagger
 * /travel-feed:
 *   get:
 *     summary: View Travel Feed
 *     description: Public users can view published public travel posts. When a valid Bearer token is provided, the response also reflects current like and block state.
 *     tags: [Travel Feed]
 *     security: []
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
 */
router.get(
  '/',
  optionalAuthenticate,
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

/**
 * @swagger
 * /travel-feed/{postId}:
 *   patch:
 *     summary: Update Post
 *     description: Customer updates their own travel feed post. Send `keep_photo_ids` to keep existing photos and `photos` to append new images.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
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
 *                 nullable: true
 *               location_id:
 *                 type: integer
 *                 nullable: true
 *               visibility:
 *                 type: string
 *                 enum: [public, private]
 *               keep_photo_ids:
 *                 type: array
 *                 maxItems: 10
 *                 items:
 *                   type: integer
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
 *                 nullable: true
 *               location_id:
 *                 type: integer
 *                 nullable: true
 *               visibility:
 *                 type: string
 *                 enum: [public, private]
 *               keep_photo_ids:
 *                 type: array
 *                 maxItems: 10
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Travel post updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required or not post owner
 *       404:
 *         description: Travel post, destination, location, or photo not found
 *       409:
 *         description: Travel post cannot be updated
 */
router.patch(
  '/:postId',
  authenticate,
  authorize('customer'),
  handleTravelPostPhotoUpload,
  validate(travelFeed.update),
  controller.update
);

/**
 * @swagger
 * /travel-feed/{postId}:
 *   delete:
 *     summary: Delete Post
 *     description: Customer soft-deletes their own travel feed post. Photos, comments, likes, and reports are kept for history, but the post no longer appears in public feed.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Travel post deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required or not post owner
 *       404:
 *         description: Travel post not found
 *       409:
 *         description: Travel post has already been deleted or cannot be deleted
 */
router.delete(
  '/:postId',
  authenticate,
  authorize('customer'),
  validate(travelFeed.postAction),
  controller.remove
);

/**
 * @swagger
 * /travel-feed/{postId}/like:
 *   post:
 *     summary: Like Post
 *     description: Customer likes a published public travel post. Repeating the request keeps the post liked without increasing like_count again.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Travel post liked successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required
 *       404:
 *         description: Travel post not found
 */
router.post(
  '/:postId/like',
  authenticate,
  authorize('customer'),
  validate(travelFeed.postAction),
  controller.likePost
);

/**
 * @swagger
 * /travel-feed/{postId}/like:
 *   delete:
 *     summary: Unlike Post
 *     description: Customer removes their like from a published public travel post. Repeating the request keeps the post unliked without decreasing like_count again.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Travel post unliked successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required
 *       404:
 *         description: Travel post not found
 */
router.delete(
  '/:postId/like',
  authenticate,
  authorize('customer'),
  validate(travelFeed.postAction),
  controller.unlikePost
);

/**
 * @swagger
 * /travel-feed/{postId}/reports:
 *   post:
 *     summary: Report Post
 *     description: Customer reports a published public travel post once. Duplicate reports from the same customer are rejected.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *                 enum: [spam, inappropriate_content, harassment, false_information, scam, other]
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Travel post reported successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required or cannot report own post
 *       404:
 *         description: Travel post not found
 *       409:
 *         description: Travel post already reported by this customer
 */
router.post(
  '/:postId/reports',
  authenticate,
  authorize('customer'),
  validate(travelFeed.report),
  controller.reportPost
);

/**
 * @swagger
 * /travel-feed/{postId}/report:
 *   patch:
 *     summary: Update Post Report
 *     description: Customer updates their pending report for a travel post. This does not increase report_count.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *                 enum: [spam, inappropriate_content, harassment, false_information, scam, other]
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Travel post report updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required
 *       404:
 *         description: Travel post or report not found
 *       409:
 *         description: Reviewed reports cannot be updated
 */
router.patch(
  '/:postId/report',
  authenticate,
  authorize('customer'),
  validate(travelFeed.report),
  controller.updateReport
);

/**
 * @swagger
 * /travel-feed/{postId}/share:
 *   post:
 *     summary: Share Post
 *     description: Customer tracks a share action for a published public travel post. The response includes a platform-specific share_url for the frontend to open.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [platform]
 *             properties:
 *               platform:
 *                 type: string
 *                 enum: [facebook, zalo, copy_link, other]
 *     responses:
 *       201:
 *         description: Share tracked successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required
 *       404:
 *         description: Travel post not found
 */
router.post(
  '/:postId/share',
  authenticate,
  authorize('customer'),
  validate(travelFeed.share),
  controller.sharePost
);

/**
 * @swagger
 * /travel-feed/{postId}/comments:
 *   get:
 *     summary: List Post Comments
 *     description: Customer lists published comments and replies for a published public travel post.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
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
 *           default: 20
 *     responses:
 *       200:
 *         description: Travel post comments retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required
 *       404:
 *         description: Travel post not found
 */
router.get(
  '/:postId/comments',
  authenticate,
  authorize('customer'),
  validate(travelFeed.listComments),
  controller.listComments
);

/**
 * @swagger
 * /travel-feed/{postId}/comments:
 *   post:
 *     summary: Create Post Comment
 *     description: Customer comments on a published public travel post. Send parent_comment_id to create a reply.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 2000
 *               parent_comment_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation error or invalid parent comment
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required
 *       404:
 *         description: Travel post not found
 */
router.post(
  '/:postId/comments',
  authenticate,
  authorize('customer'),
  validate(travelFeed.createComment),
  controller.createComment
);

/**
 * @swagger
 * /travel-feed/comments/{commentId}:
 *   patch:
 *     summary: Update Comment
 *     description: Customer updates their own published comment.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 2000
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required or not comment owner
 *       404:
 *         description: Comment not found
 */
router.patch(
  '/comments/:commentId',
  authenticate,
  authorize('customer'),
  validate(travelFeed.updateComment),
  controller.updateComment
);

/**
 * @swagger
 * /travel-feed/comments/{commentId}:
 *   delete:
 *     summary: Delete Comment
 *     description: Customer soft-deletes their own published comment and decreases the post comment_count.
 *     tags: [Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Customer role required or not comment owner
 *       404:
 *         description: Comment not found
 */
router.delete(
  '/comments/:commentId',
  authenticate,
  authorize('customer'),
  validate(travelFeed.commentAction),
  controller.deleteComment
);

module.exports = router;
