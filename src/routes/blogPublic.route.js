const express = require('express');
const controller = require('../controllers/blog.controller');
const blogCommentController = require('../controllers/blogComment.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { blogComment, common, entity } = require('../validators');
const { handleBlogThumbnailUpload } = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/', validate({ query: common.paginationQuery }), controller.publicList);
/**
 * @swagger
 * /blogs/{blogId}/comments:
 *   get:
 *     summary: List approved comments for a blog
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: integer
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
 *           example: 20
 *     responses:
 *       200:
 *         description: Blog comments with pagination
 *       404:
 *         description: Blog not found
 *   post:
 *     summary: Create a comment for a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Bai viet rat huu ich.
 *               comment:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Bai viet rat huu ich.
 *               parent_comment_id:
 *                 type: integer
 *                 nullable: true
 *                 description: Optional parent comment id when creating a reply through this endpoint.
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 *
 * /blogs/{blogId}/comments/{commentId}/replies:
 *   post:
 *     summary: Reply to a blog comment
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Parent comment id. Replies are limited to one level.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Minh dong y voi binh luan nay.
 *               comment:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Minh dong y voi binh luan nay.
 *     responses:
 *       201:
 *         description: Reply created successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog or parent comment not found
 *
 * /blogs/{blogId}/comments/{commentId}:
 *   put:
 *     summary: Update current customer's blog comment
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: integer
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
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Noi dung binh luan da cap nhat.
 *               comment:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Noi dung binh luan da cap nhat.
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Comment does not belong to current customer
 *       404:
 *         description: Blog or comment not found
 *   delete:
 *     summary: Delete current customer's blog comment
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Comment does not belong to current customer
 *       404:
 *         description: Blog or comment not found
 */
router
  .route('/:blogId/comments')
  .get(validate(blogComment.list), blogCommentController.list)
  .post(
    authenticate,
    authorize('customer'),
    validate(blogComment.create),
    blogCommentController.create
  );
router.post(
  '/:blogId/comments/:commentId/replies',
  authenticate,
  authorize('customer'),
  validate(blogComment.createReply),
  blogCommentController.createReply
);
router
  .route('/:blogId/comments/:commentId')
  .put(
    authenticate,
    authorize('customer'),
    validate(blogComment.update),
    blogCommentController.update
  )
  .delete(
    authenticate,
    authorize('customer'),
    validate(blogComment.remove),
    blogCommentController.remove
  );
router.get('/:idOrSlug', validate({ params: common.blogIdentifierParam }), controller.publicGet);
router.post('/', authenticate, authorize('customer'), handleBlogThumbnailUpload, validate({ body: entity.blog }), controller.create);
router.put(
  '/:id',
  authenticate,
  authorize('customer'),
  handleBlogThumbnailUpload,
  validate({ params: common.idParam, body: entity.blogUpdate }),
  controller.update
);
router.delete('/:id', authenticate, authorize('customer'), validate({ params: common.idParam }), controller.remove);

module.exports = router;
