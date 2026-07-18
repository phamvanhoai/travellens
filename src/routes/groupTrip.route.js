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
 *     summary: Create an independent self-planned group trip
 *     tags: [Group Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, start_date, end_date]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Da Lat weekend trip
 *               description:
 *                 type: string
 *               destination_id:
 *                 type: integer
 *               destination_name:
 *                 type: string
 *                 example: Da Lat
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               max_members:
 *                 type: integer
 *               visibility:
 *                 type: string
 *                 enum: [public, private]
 *                 default: private
 *                 example: private
 *     responses:
 *       201:
 *         description: Group trip created and creator assigned as leader
 *       400:
 *         description: Invalid trip dates or destination
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
 *   delete:
 *     summary: Delete a group trip
 *     description: Only the active group leader can soft-delete the group trip. Pending invitations are canceled and history is retained.
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
 *         description: Group trip soft-deleted successfully
 *       403:
 *         description: Only the group leader can delete the group trip
 *       404:
 *         description: Group trip not found
 *       409:
 *         description: Group trip has already been deleted
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
  .get(validate({ params: groupTrip.idParam }), controller.get)
  .delete(validate({ params: groupTrip.idParam }), controller.delete);

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

/**
 * @swagger
 * /group-trips/{id}/itinerary:
 *   post:
 *     summary: Add an itinerary item
 *     description: Only the group leader can add an item within the trip date range.
 *     tags: [Group Trips]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itinerary_date, title]
 *             properties:
 *               itinerary_date: { type: string, format: date, example: '2026-08-11' }
 *               start_time: { type: string, example: '17:30' }
 *               title: { type: string, example: 'Explore Hoi An Ancient Town' }
 *               description: { type: string, nullable: true }
 *               location_id: { type: integer, nullable: true, description: System location; cannot be combined with custom location fields. }
 *               custom_location: { type: string, nullable: true, example: 'Hoi An Ancient Town' }
 *               latitude: { type: number, format: double, minimum: -90, maximum: 90, nullable: true, example: 15.8801 }
 *               longitude: { type: number, format: double, minimum: -180, maximum: 180, nullable: true, example: 108.338 }
 *               order_index: { type: integer, minimum: 0, default: 0 }
 *     responses:
 *       201: { description: Itinerary item created }
 *       400: { description: Invalid coordinates, location mode, or itinerary date }
 * /group-trips/{id}/itinerary/{itemId}:
 *   patch:
 *     summary: Update an itinerary item
 *     tags: [Group Trips]
 *     security: [{ bearerAuth: [] }]
 *     description: Switching to location_id clears custom_location and coordinates. Switching to custom requires its name and coordinates.
 *     responses:
 *       200: { description: Itinerary item updated }
 *   delete:
 *     summary: Delete an itinerary item
 *     tags: [Group Trips]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Itinerary item deleted }
 */
router.post(
  '/:id/itinerary',
  validate(groupTrip.createItineraryItem),
  controller.addItineraryItem
);

router
  .route('/:id/itinerary/:itemId')
  .patch(validate(groupTrip.updateItineraryItem), controller.updateItineraryItem)
  .delete(validate({ params: groupTrip.itineraryParam }), controller.deleteItineraryItem);

router.post(
  '/:id/invites',
  validate(groupTrip.invite),
  controller.inviteMember
);

module.exports = router;
