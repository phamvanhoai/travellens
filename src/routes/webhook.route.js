const express = require('express');
const sepayController = require('../controllers/sepayWebhook.controller');
const zaloController = require('../controllers/zaloWebhook.controller');
const validate = require('../middlewares/validate.middleware');
const { sepayWebhook, zaloWebhook } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Webhooks
 *     description: External provider webhook endpoints
 *
 * /webhooks/sepay:
 *   post:
 *     summary: Receive SePay payment webhook
 *     tags: [Webhooks]
 *     security:
 *       - sepayApiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, transferType, transferAmount]
 *             properties:
 *               id:
 *                 type: string
 *                 example: "123456789"
 *               gateway:
 *                 type: string
 *                 example: MBBank
 *               transactionDate:
 *                 type: string
 *                 example: "2026-06-01 10:00:00"
 *               accountNumber:
 *                 type: string
 *                 example: "123456789"
 *               code:
 *                 type: string
 *                 example: TVL000123ABCD
 *               content:
 *                 type: string
 *                 example: TVL000123ABCD
 *               transferType:
 *                 type: string
 *                 enum: [in, out]
 *                 example: in
 *               transferAmount:
 *                 type: number
 *                 example: 700000
 *               referenceCode:
 *                 type: string
 *                 example: BANK_REF_123
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       401:
 *         description: Invalid API key
 */
router.post('/sepay', validate(sepayWebhook.handle), sepayController.handle);
router.post('/zalo', validate(zaloWebhook.handle), zaloController.handle);

module.exports = router;
