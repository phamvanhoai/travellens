const express = require('express');
const controller = require('../controllers/blogCategory.controller');
const validate = require('../middlewares/validate.middleware');
const { common } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * /blog-categories:
 *   get:
 *     summary: List blog categories
 *     tags: [Blog Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Blog category list }
 * /blog-categories/{id}:
 *   get:
 *     summary: Get blog category detail
 *     tags: [Blog Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Blog category detail }
 *       404: { description: Blog category not found }
 */
router.get('/', validate({ query: common.paginationQuery }), controller.list);
router.get('/:id', validate({ params: common.idParam }), controller.get);

module.exports = router;
