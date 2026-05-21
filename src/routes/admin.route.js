const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const statisticsController = require('../controllers/statistics.controller');

const router = express.Router();

router.use(authenticate, authorize('admin'));

/**
 * @swagger
 * tags:
 *   - name: Admin Statistics
 *     description: Admin dashboard and reporting endpoints. Requires Bearer token with role `admin`.
 *   - name: Admin Travel Destinations
 *     description: Admin travel destination management. Requires Bearer token with role `admin`.
 *   - name: Admin Destination Categories
 *     description: Admin destination category management. Requires Bearer token with role `admin`.
 *   - name: Admin Tour Categories
 *     description: Admin tour category management. Requires Bearer token with role `admin`.
 *
 * /admin/statistics/system:
 *   get:
 *     summary: View system statistics
 *     tags: [Admin Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *
 * /admin/statistics/users:
 *   get:
 *     summary: View user statistics
 *     tags: [Admin Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *
 * /admin/statistics/locations:
 *   get:
 *     summary: View location statistics
 *     tags: [Admin Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Location statistics
 *
 * /admin/statistics/content:
 *   get:
 *     summary: View content statistics
 *     tags: [Admin Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Content statistics
 */
router.get('/statistics/system', statisticsController.dashboard);
router.get('/statistics/users', statisticsController.users);
router.get('/statistics/locations', statisticsController.locations);
router.get('/statistics/content', statisticsController.content);

/**
 * @swagger
 * /admin/travel-destinations:
 *   get:
 *     summary: Admin list travel destinations
 *     description: Supports pagination, search by name/description, category filter, and sort by created_at descending.
 *     tags: [Admin Travel Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: dinh
 *       - in: query
 *         name: destination_category_id
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Travel destination list with pagination
 *   post:
 *     summary: Admin create travel destination
 *     description: Creates a destination after validating admin role and duplicate name.
 *     tags: [Admin Travel Destinations]
 *     security:
 *       - bearerAuth: []
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
 *                 example: Dinh Doc Lap
 *               description:
 *                 type: string
 *                 example: Historic landmark in Ho Chi Minh City
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/dinhdoclap.jpg
 *               destination_category_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: Travel destination created successfully
 *       409:
 *         description: Travel destination name already exists
 *
 * /admin/travel-destinations/{id}:
 *   get:
 *     summary: Admin get travel destination detail
 *     description: Includes locations, tours, view360, and statistics.
 *     tags: [Admin Travel Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Travel destination detail
 *   put:
 *     summary: Admin update travel destination
 *     description: Updates one or more travel destination fields. Fields not provided are kept unchanged.
 *     tags: [Admin Travel Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dinh Doc Lap Updated
 *               description:
 *                 type: string
 *                 example: Updated historic landmark description
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 example: https://example.com/dinhdoclap-updated.jpg
 *               destination_category_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       200:
 *         description: Updated successfully
 *   delete:
 *     summary: Admin delete travel destination
 *     description: Soft deletes the destination only when it has no tours or locations.
 *     tags: [Admin Travel Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       400:
 *         description: Cannot delete while tours or locations still exist
 *
 * /admin/destination-categories:
 *   get:
 *     summary: Admin list destination categories
 *     tags: [Admin Destination Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Destination category list
 *   post:
 *     summary: Admin create destination category
 *     tags: [Admin Destination Categories]
 *     security:
 *       - bearerAuth: []
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
 *
 * /admin/destination-categories/{id}:
 *   get:
 *     summary: Admin get destination category detail
 *     tags: [Admin Destination Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Destination category detail
 *   put:
 *     summary: Admin update destination category
 *     tags: [Admin Destination Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *                 example: Historical Updated
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Updated destination category description
 *     responses:
 *       200:
 *         description: Destination category updated
 *   delete:
 *     summary: Admin delete destination category
 *     tags: [Admin Destination Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Destination category deleted
 *
 * /admin/tour-categories:
 *   get:
 *     summary: Admin list tour categories
 *     tags: [Admin Tour Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tour category list
 *   post:
 *     summary: Admin create tour category
 *     tags: [Admin Tour Categories]
 *     security:
 *       - bearerAuth: []
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
router.use('/users', require('./user.route'));
router.use('/travel-destinations', require('./travelDestination.route'));
router.use('/tours', require('./tour.route'));
router.use('/locations', require('./location.route'));
router.use('/blogs', require('./blog.route'));
router.use('/maps', require('./map.route'));
router.use('/destination-categories', require('./destinationCategory.route'));
router.use('/tour-categories', require('./tourCategory.route'));
router.use('/statistics', require('./statistics.route'));

module.exports = router;
