const express = require('express');
const controller = require('../controllers/travelStory.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { handleTravelStoryMediaUpload } = require('../middlewares/upload.middleware');
const schema = require('../validators/travelStory.validator');

const router = express.Router();
router.use(authenticate);

/**
 * @swagger
 * /travel-stories:
 *   get:
 *     summary: List active unexpired Facebook-style travel stories
 *     tags: [Travel Stories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Story feed with viewed state and pagination }
 *   post:
 *     summary: Create an image or video travel story that expires after 24 hours
 *     tags: [Travel Stories]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [media_file]
 *             properties:
 *               media_file: { type: string, format: binary }
 *               caption: { type: string, maxLength: 1000 }
 *         application/json:
 *           schema:
 *             type: object
 *             required: [media_url, media_type]
 *             properties:
 *               media_url: { type: string }
 *               media_type: { type: string, enum: [image, video] }
 *               caption: { type: string, maxLength: 1000 }
 *     responses:
 *       201: { description: Story created }
 * /travel-stories/mine:
 *   get:
 *     summary: List current customer's active or expired stories
 *     tags: [Travel Stories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Own story list }
 * /travel-stories/{id}:
 *   get:
 *     summary: Get one active story
 *     tags: [Travel Stories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Story detail }
 *   delete:
 *     summary: Soft delete current customer's story
 *     tags: [Travel Stories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Story deleted }
 * /travel-stories/{id}/view:
 *   post:
 *     summary: Mark a story as viewed once by current customer
 *     tags: [Travel Stories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: View recorded idempotently }
 * /travel-stories/{id}/viewers:
 *   get:
 *     summary: Story owner lists customers who viewed the story
 *     tags: [Travel Stories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Viewer list with pagination }
 */

router.get('/', authorize('customer', 'admin', 'staff'), validate(schema.list), controller.list);
router.post('/', authorize('customer'), handleTravelStoryMediaUpload, validate(schema.create), controller.create);
router.get('/mine', authorize('customer'), validate(schema.mine), controller.mine);
router.post('/:id/view', authorize('customer'), validate(schema.action), controller.view);
router.get('/:id/viewers', authorize('customer'), validate(schema.viewers), controller.viewers);
router.get('/:id', authorize('customer', 'admin', 'staff'), validate(schema.action), controller.get);
router.delete('/:id', authorize('customer'), validate(schema.action), controller.remove);

module.exports = router;
