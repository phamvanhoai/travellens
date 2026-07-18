const express = require('express');
const controller = require('../controllers/groupTrip.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { groupTrip } = require('../validators');

const router = express.Router();

router.use(authenticate, authorize('customer'));

/**
 * @swagger
 * /group-trip-invites:
 *   get:
 *     summary: List invitations received by current customer
 *     tags: [Group Trips]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Invitation list with pagination }
 * /group-trip-invites/{inviteId}/accept:
 *   post:
 *     summary: Accept an invitation from the in-app pending list
 *     tags: [Group Trips]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Joined group trip }
 * /group-trip-invites/{inviteId}/decline:
 *   post:
 *     summary: Decline an invitation
 *     tags: [Group Trips]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Invitation declined }
 */

router.get(
  '/',
  validate({ query: groupTrip.inviteListQuery }),
  controller.listMyInvites
);

router.post(
  '/:inviteId(\\d+)/accept',
  validate({ params: groupTrip.inviteIdParam }),
  controller.acceptInviteById
);

router.post(
  '/:inviteId(\\d+)/decline',
  validate({ params: groupTrip.inviteIdParam }),
  controller.declineInvite
);

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
 * /group-trip-invites/{token}:
 *   get:
 *     summary: Check invitation status before showing the accept action
 *     description: Returns the current status, can_accept flag, unavailable reason, and group trip summary. The logged-in customer must own the invitation.
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
 *         description: Invitation status retrieved
 *       403:
 *         description: Invitation belongs to another customer
 *       404:
 *         description: Invitation not found
 */

router.get(
  '/:token',
  validate({ params: groupTrip.tokenParam }),
  controller.getInviteByToken
);

router.post(
  '/:token/accept',
  validate({ params: groupTrip.tokenParam }),
  controller.acceptInvite
);

module.exports = router;
