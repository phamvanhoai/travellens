const express = require('express');
const controller = require('../controllers/view360.controller');
const hotspotController = require('../controllers/view360Hotspot.controller');
const validate = require('../middlewares/validate.middleware');
const { common, view360Hotspot } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * /view360/{view360Id}/hotspots:
 *   get:
 *     summary: List active hotspots for a View360 scene
 *     tags: [View360]
 *     parameters:
 *       - in: path
 *         name: view360Id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Active hotspot list for the scene
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       hotspot_id:
 *                         type: integer
 *                         example: 1
 *                       view360_id:
 *                         type: integer
 *                         example: 3
 *                       type:
 *                         type: string
 *                         enum: [info, navigation, link, location]
 *                         example: info
 *                       title:
 *                         type: string
 *                         nullable: true
 *                         example: Cổng chính
 *                       description:
 *                         type: string
 *                         nullable: true
 *                         example: Khu vực lối vào chính
 *                       yaw:
 *                         type: number
 *                         example: 120.5
 *                       pitch:
 *                         type: number
 *                         example: -8.2
 *                       target_view360_id:
 *                         type: integer
 *                         nullable: true
 *                       target_url:
 *                         type: string
 *                         nullable: true
 *                       order_index:
 *                         type: integer
 *                         example: 1
 *                       is_active:
 *                         type: boolean
 *                         example: true
 */
router.get('/', validate({ query: common.paginationQuery }), controller.list);
router.get(
  '/:view360Id/hotspots',
  validate(view360Hotspot.viewParam),
  hotspotController.listPublicByView
);
router.get('/:id', validate({ params: common.idParam }), controller.get);

module.exports = router;
