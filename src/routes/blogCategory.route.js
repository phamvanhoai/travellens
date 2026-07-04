const createCrudRoute = require('./crud.route');
const controller = require('../controllers/blogCategory.controller');
const { entity } = require('../validators');

/**
 * @swagger
 * /admin/blog-categories:
 *   get:
 *     summary: Admin list blog categories
 *     tags: [Admin Blog Categories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Blog category list }
 *   post:
 *     summary: Admin create blog category
 *     tags: [Admin Blog Categories]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: Travel Guide }
 *               description: { type: string, nullable: true }
 *     responses:
 *       201: { description: Blog category created }
 * /admin/blog-categories/{id}:
 *   get:
 *     summary: Admin get blog category detail
 *     tags: [Admin Blog Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Blog category detail }
 *   put:
 *     summary: Admin update blog category
 *     tags: [Admin Blog Categories]
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
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string, nullable: true }
 *     responses:
 *       200: { description: Blog category updated }
 *   delete:
 *     summary: Admin delete an unused blog category
 *     tags: [Admin Blog Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Blog category deleted }
 *       409: { description: Category still has linked blogs }
 */
module.exports = createCrudRoute(controller, entity.blogCategory);
