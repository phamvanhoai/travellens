const createCrudRoute = require('./crud.route');
const controller = require('../controllers/destinationCategory.controller');
const { entity } = require('../validators');

/**
 * @swagger
 * tags:
 *   - name: DestinationCategories
 *     description: Categories for travel destinations
 *
 * /destination-categories:
 *   get:
 *     summary: List destination categories
 *     tags: [DestinationCategories]
 *     responses:
 *       200:
 *         description: Destination category list
 *   post:
 *     summary: Create destination category
 *     tags: [DestinationCategories]
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
 *                 example: Historical
 *               description:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Destination category created
 */
module.exports = createCrudRoute(controller, entity.destinationCategory);
