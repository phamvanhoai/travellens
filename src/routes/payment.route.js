const express = require('express');
const controller = require('../controllers/payment.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { payment } = require('../validators');

const router = express.Router();

router.use(authenticate, authorize('customer'));

/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: Customer SePay bank-transfer payment endpoints
 *
 * /payments:
 *   get:
 *     summary: List current customer's payments
 *     description: Returns only payments belonging to bookings owned by the authenticated customer.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, paid, failed, expired, refunded] }
 *     responses:
 *       200: { description: Customer-owned payment list with pagination }
 *   post:
 *     summary: Create SePay payment for a booking
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [booking_id]
 *             properties:
 *               booking_id:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Payment created successfully }
 *                 data: { $ref: '#/components/schemas/CustomerPayment' }
 *       400:
 *         description: Booking is not payable
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Booking not found
 *
 * /payments/{id}:
 *   get:
 *     summary: Get own payment detail
 *     tags: [Payments]
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
 *         description: Payment detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Success }
 *                 data: { $ref: '#/components/schemas/CustomerPayment' }
 *       404:
 *         description: Payment not found
 *
 * /payments/{id}/status:
 *   get:
 *     summary: Get own payment status
 *     tags: [Payments]
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
 *         description: Latest payment status
 */
router.get('/', validate(payment.customerList), controller.customerList);
router.post('/', validate(payment.create), controller.create);
router.get('/:id', validate(payment.idParam), controller.getOwned);
router.get('/:id/status', validate(payment.idParam), controller.getOwnedStatus);

module.exports = router;
