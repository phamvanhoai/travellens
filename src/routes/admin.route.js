const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const statisticsController = require('../controllers/statistics.controller');

const router = express.Router();

router.use(authenticate, authorize('admin'));

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin-only endpoints. All endpoints require Bearer token with role `admin`.
 *
 * /admin/statistics/system:
 *   get:
 *     summary: View system statistics
 *     tags: [Admin]
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
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *
 * /admin/statistics/locations:
 *   get:
 *     summary: View location statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Location statistics
 *
 * /admin/statistics/content:
 *   get:
 *     summary: View content statistics
 *     tags: [Admin]
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

router.use('/users', require('./user.route'));
router.use('/travel-destinations', require('./travelDestination.route'));
router.use('/tours', require('./tour.route'));
router.use('/locations', require('./location.route'));
router.use('/blogs', require('./blog.route'));
router.use('/maps', require('./map.route'));
router.use('/categories', require('./category.route'));
router.use('/statistics', require('./statistics.route'));

module.exports = router;

