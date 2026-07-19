const express = require('express');
const controller = require('../controllers/tourContentItem.controller');
const validate = require('../middlewares/validate.middleware');
const schema = require('../validators/tourContentItem.validator');

const router = express.Router();

/**
 * @swagger
 * /admin/tour-content-items:
 *   get:
 *     summary: List individually reusable tour content items
 *     tags: [Admin Tour Content Items]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [highlight, requirement, inclusion, exclusion, booking_policy, cancellation_policy, additional_information] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Content item list }
 *   post:
 *     summary: Create one reusable tour content item
 *     tags: [Admin Tour Content Items]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, content]
 *             properties:
 *               type: { type: string, enum: [highlight, requirement, inclusion, exclusion, booking_policy, cancellation_policy, additional_information] }
 *               content: { type: string }
 *               status: { type: string, enum: [active, inactive], default: active }
 *     responses:
 *       201: { description: Content item created }
 * /admin/tour-content-items/{id}:
 *   get:
 *     summary: Get one reusable tour content item
 *     tags: [Admin Tour Content Items]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Content item detail }
 *   put:
 *     summary: Update one reusable tour content item
 *     tags: [Admin Tour Content Items]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, minProperties: 1 }
 *     responses:
 *       200: { description: Content item updated }
 *   delete:
 *     summary: Soft delete one reusable tour content item
 *     tags: [Admin Tour Content Items]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Content item deleted }
 */

router.route('/')
  .get(validate(schema.list), controller.list)
  .post(validate(schema.create), controller.create);
router.route('/:id')
  .get(validate(schema.detail), controller.get)
  .put(validate(schema.update), controller.update)
  .delete(validate(schema.remove), controller.remove);

module.exports = router;
