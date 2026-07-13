const express = require('express');
const controller = require('../controllers/groupTrip.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { groupTrip } = require('../validators');

const router = express.Router();

router.use(authenticate, authorize('customer'));

/**
 * @swagger
 * /group-trip-invites/{token}/accept:
 *   post:
 *     summary: Accept group trip invitation
 *     description: Alias endpoint for the accept link sent by email. The logged-in customer must match the invited account.
 *     tags: [Group Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 64
 *           maxLength: 64
 *     responses:
 *       200:
 *         description: Joined group trip
 *       400:
 *         description: Invitation is expired or already used
 *       403:
 *         description: Invitation belongs to another customer account
 *       404:
 *         description: Invitation not found
 */

router.post(
  '/:token/accept',
  validate({ params: groupTrip.tokenParam }),
  controller.acceptInvite
);

module.exports = router;
