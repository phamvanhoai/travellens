const express = require('express');
const controller = require('../controllers/mediaFile.controller');
const validate = require('../middlewares/validate.middleware');
const { handleMediaUpload } = require('../middlewares/upload.middleware');
const { media } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Admin Media
 *     description: Reusable image library for blog content. Admin authorization is required.
 * /admin/media:
 *   get:
 *     summary: List reusable media images
 *     tags: [Admin Media]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: mime_type, schema: { type: string } }
 *     responses:
 *       200: { description: Media list }
 *   post:
 *     summary: Upload an image to the media library
 *     tags: [Admin Media]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file: { type: string, format: binary }
 *     responses:
 *       201: { description: Image uploaded }
 *       413: { description: File too large }
 *       415: { description: Unsupported image format }
 * /admin/media/{id}:
 *   get:
 *     summary: Get media details
 *     tags: [Admin Media]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Media details }
 *       404: { description: Media not found }
 *   delete:
 *     summary: Soft delete an unused media image
 *     tags: [Admin Media]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Media deleted }
 *       409: { description: Image is used by a blog }
 *   put:
 *     summary: Update the media display name
 *     description: Updates original_name only. The physical filename and URL remain unchanged.
 *     tags: [Admin Media]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [original_name]
 *             properties:
 *               original_name: { type: string, maxLength: 255, example: Bien Da Nang } 
 *     responses:
 *       200: { description: Media display name updated }
 *       404: { description: Media not found }
 */
router.get('/', validate(media.list), controller.list);
router.post('/', handleMediaUpload, controller.upload);
router.get('/:id', validate(media.id), controller.get);
router.put('/:id', validate(media.update), controller.update);
router.delete('/:id', validate(media.id), controller.remove);

module.exports = router;
