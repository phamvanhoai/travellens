const express = require('express');
const controller = require('../controllers/travelFeed.controller');
const validate = require('../middlewares/validate.middleware');
const { travelFeed } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * /admin/travel-feed:
 *   get:
 *     summary: Admin view travel posts
 *     description: Admin lists travel feed posts with author, destination, location, photos, counters, status, visibility, and report summary.
 *     tags: [Admin Travel Feed]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, hidden, deleted]
 *       - in: query
 *         name: visibility
 *         schema:
 *           type: string
 *           enum: [public, private]
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
 *         name: has_reports
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: include_deleted
 *         schema:
 *           type: boolean
 *           default: false
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, popular, reported]
 *           default: newest
 *     responses:
 *       200:
 *         description: Travel post list with pagination
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 */
router.get('/', validate(travelFeed.adminList), controller.adminList);

/**
 * @swagger
 * /admin/travel-feed/comments:
 *   get:
 *     summary: Admin view travel post comments
 *     description: Admin lists travel feed comments with author and post summary. Supports filtering by post, user, status, parent/reply state, and deleted records.
 *     tags: [Admin Travel Feed]
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: post_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [published, hidden, deleted]
 *       - in: query
 *         name: has_parent
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: include_deleted
 *         schema:
 *           type: boolean
 *           default: false
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest]
 *           default: newest
 *     responses:
 *       200:
 *         description: Travel post comment list with pagination
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 */
router.get('/comments', validate(travelFeed.adminListComments), controller.adminListComments);

/**
 * @swagger
 * /admin/travel-feed/comments/{commentId}:
 *   delete:
 *     summary: Admin delete travel post comment
 *     description: Admin soft-deletes a travel feed comment by setting status to deleted and deleted_at. Published comment deletion decreases the parent post comment_count.
 *     tags: [Admin Travel Feed]
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
 *         description: Travel post comment deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Travel post comment not found
 */
router.delete('/comments/:commentId', validate(travelFeed.adminCommentAction), controller.adminRemoveComment);

/**
 * @swagger
 * /admin/travel-feed/reports:
 *   get:
 *     summary: Admin view travel post reports
 *     description: Admin lists reports for travel feed posts with reporter, reviewer, and post summary. Deleted posts are included by default for audit visibility.
 *     tags: [Admin Travel Feed]
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: post_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: reviewed_by
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewed, dismissed, resolved]
 *       - in: query
 *         name: reason
 *         schema:
 *           type: string
 *           enum: [spam, inappropriate_content, harassment, false_information, scam, other]
 *       - in: query
 *         name: include_deleted_posts
 *         schema:
 *           type: boolean
 *           default: true
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest]
 *           default: newest
 *     responses:
 *       200:
 *         description: Travel post report list with pagination
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 */
router.get('/reports', validate(travelFeed.adminListReports), controller.adminListReports);

/**
 * @swagger
 * /admin/travel-feed/reports/{reportId}/review:
 *   patch:
 *     summary: Admin review reported post
 *     description: Admin marks a travel post report as reviewed, dismissed, or resolved.
 *     tags: [Admin Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [reviewed, dismissed, resolved]
 *     responses:
 *       200:
 *         description: Travel post report reviewed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Travel post report not found
 */
router.patch('/reports/:reportId/review', validate(travelFeed.adminReviewReport), controller.adminReviewReport);

/**
 * @swagger
 * /admin/travel-feed/reports/{reportId}/violated-post:
 *   delete:
 *     summary: Admin delete violated reported post
 *     description: Admin soft-deletes the post referenced by a report and resolves all pending reports for that post.
 *     tags: [Admin Travel Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Violated travel post deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: Travel post report or post not found
 */
router.delete('/reports/:reportId/violated-post', validate(travelFeed.adminReportAction), controller.adminDeleteViolatedPost);

/**
 * @swagger
 * /admin/travel-feed/{postId}:
 *   delete:
 *     summary: Admin delete travel post
 *     description: Admin soft-deletes a travel feed post by setting status to deleted and deleted_at. The record is kept for audit history.
 *     tags: [Admin Travel Feed]
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
 *         description: Admin role required
 *       404:
 *         description: Travel post not found
 */
router.delete('/:postId', validate(travelFeed.adminPostAction), controller.adminRemove);

module.exports = router;
