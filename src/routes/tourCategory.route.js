const createCrudRoute = require('./crud.route');
const controller = require('../controllers/tourCategory.controller');
const { entity } = require('../validators');

/**
 * @swagger
 * tags:
 *   - name: TourCategories
 *     description: Categories for tour packages
 *
 * /tour-categories:
 *   get:
 *     summary: List tour categories
 *     tags: [TourCategories]
 *     responses:
 *       200:
 *         description: Tour category list
 *   post:
 *     summary: Create tour category
 *     tags: [TourCategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Family
 *               description:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Tour category created
 */
module.exports = createCrudRoute(controller, entity.tourCategory);
