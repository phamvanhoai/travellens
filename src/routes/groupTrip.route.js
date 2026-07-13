const express = require('express');
const controller = require('../controllers/groupTrip.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { groupTrip } = require('../validators');

const router = express.Router();

router.use(authenticate, authorize('customer'));

/**
 * @swagger
 * tags:
 *   - name: Group Trips
 *     description: Customer group trip endpoints. Requires Bearer token with role `customer`.
 *
 * /group-trips:
 *   get:
 *     summary: List current customer's group trips
 *     tags: [Group Trips]
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
 *     responses:
 *       200:
 *         description: Group trip list
 *   post:
 *     summary: Create a group trip from current customer's booking
 *     tags: [Group Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [booking_id, name]
 *             properties:
 *               booking_id:
 *                 type: integer
 *                 example: 12
 *               name:
 *                 type: string
 *                 example: Da Nang summer group
 *               visibility:
 *                 type: string
 *                 enum: [public, private]
 *                 default: private
 *                 example: private
 *     responses:
 *       201:
 *         description: Group trip created and creator assigned as leader
 *       404:
 *         description: Booking not found
 *       409:
 *         description: Group trip already exists for this booking
 *
 * /group-trips/{id}:
 *   get:
 *     summary: Get group trip detail
 *     tags: [Group Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Group trip detail with member list
 *       403:
 *         description: Private group trip requires active membership
 *       404:
 *         description: Group trip not found
 *
 * /group-trips/{id}/members:
 *   get:
 *     summary: View or search group trip members
 *     tags: [Group Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         description: Search by member name, email, or phone.
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *     responses:
 *       200:
 *         description: Active member list
 *
 * /group-trips/{id}/leave:
 *   post:
 *     summary: Leave a group trip
 *     description: Leader must transfer leadership before leaving if other active members remain.
 *     tags: [Group Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Left group trip
 *       409:
 *         description: Leader must transfer leadership first
 *
 * /group-trips/{id}/members/{userId}:
 *   delete:
 *     summary: Remove a member from group trip
 *     description: Only the active group leader can remove another active member.
 *     tags: [Group Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Member removed
 *       403:
 *         description: Only group leader can remove members
 *
 * /group-trips/{id}/leader:
 *   patch:
 *     summary: Assign or change group leader
 *     description: New leader must be an active member of the group trip.
 *     tags: [Group Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id]
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Group leader changed
 *
 * /group-trips/{id}/settings:
 *   patch:
 *     summary: Update group trip settings
 *     description: Only the active group leader can update name or public/private visibility.
 *     tags: [Group Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
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
 *                 example: Updated group name
 *               visibility:
 *                 type: string
 *                 enum: [public, private]
 *                 example: public
 *     responses:
 *       200:
 *         description: Group trip settings updated
 *
 * /group-trips/{id}/invites:
 *   post:
 *     summary: Invite a customer by email
 *     description: Sends an invitation email. Only the invited active customer account can accept the token.
 *     tags: [Group Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: customer@example.com
 *     responses:
 *       201:
 *         description: Invitation created and email send attempted
 *       404:
 *         description: Invited customer account not found
 *       409:
 *         description: Customer is already member or already has pending invite
 *
 * /group-trips/invites/{token}/accept:
 *   post:
 *     summary: Accept group trip invitation
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
 */

router
  .route('/')
  .get(validate({ query: groupTrip.listQuery }), controller.list)
  .post(validate(groupTrip.create), controller.create);

router.post(
  '/invites/:token/accept',
  validate({ params: groupTrip.tokenParam }),
  controller.acceptInvite
);

router
  .route('/:id')
  .get(validate({ params: groupTrip.idParam }), controller.get);

router.get(
  '/:id/members',
  validate({ params: groupTrip.idParam, query: groupTrip.listQuery }),
  controller.listMembers
);

router.post(
  '/:id/leave',
  validate({ params: groupTrip.idParam }),
  controller.leave
);

router.delete(
  '/:id/members/:userId',
  validate({ params: groupTrip.memberParam }),
  controller.removeMember
);

router.patch(
  '/:id/leader',
  validate(groupTrip.changeLeader),
  controller.changeLeader
);

router.patch(
  '/:id/settings',
  validate(groupTrip.updateSettings),
  controller.updateSettings
);

router.post(
  '/:id/invites',
  validate(groupTrip.invite),
  controller.inviteMember
);

module.exports = router;
