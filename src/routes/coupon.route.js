const createCrudRoute = require('./crud.route');
const controller = require('../controllers/coupon.controller');
const { entity } = require('../validators');

/**
 * @swagger
 * tags:
 *   - name: Coupons
 *     description: Coupon management endpoints
 *
 * /coupons:
 *   get:
 *     summary: List coupons
 *     tags: [Coupons]
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
 *           example: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: SUMMER
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, expired]
 *     responses:
 *       200:
 *         description: Coupon list
 *   post:
 *     summary: Create coupon
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, discount_type, discount_value]
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUMMER10
 *               name:
 *                 type: string
 *                 example: Summer discount
 *               description:
 *                 type: string
 *                 nullable: true
 *               discount_type:
 *                 type: string
 *                 enum: [percent, fixed]
 *                 example: percent
 *               discount_value:
 *                 type: number
 *                 example: 10
 *               min_order_amount:
 *                 type: number
 *                 example: 1000000
 *               max_discount_amount:
 *                 type: number
 *                 nullable: true
 *                 example: 300000
 *               usage_limit:
 *                 type: integer
 *                 nullable: true
 *                 example: 100
 *               starts_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               expires_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               status:
 *                 type: string
 *                 enum: [active, inactive, expired]
 *                 example: active
 *     responses:
 *       201:
 *         description: Coupon created
 *       409:
 *         description: Coupon code already exists
 *
 * /coupons/{id}:
 *   get:
 *     summary: Get coupon by id
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Coupon detail
 *   put:
 *     summary: Update coupon
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Coupon updated
 *   delete:
 *     summary: Delete coupon
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Coupon deleted
 */
module.exports = createCrudRoute(controller, entity.coupon);
