const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const groupTripService = require('../services/groupTrip.service');

module.exports = {
  listPublic: asyncHandler(async (req, res) => {
    const data = await groupTripService.listPublic(req.query);
    response.success(res, data, 'Public group trips retrieved');
  }),

  getPublic: asyncHandler(async (req, res) => {
    const data = await groupTripService.getPublic(req.params.id);
    response.success(res, data, 'Public group trip retrieved');
  }),

  create: asyncHandler(async (req, res) => {
    const data = await groupTripService.create(req.user.sub, req.body);
    response.success(res, data, 'Created', 201);
  }),

  list: asyncHandler(async (req, res) => {
    const data = await groupTripService.listForUser(req.user.sub, req.query);
    response.success(res, data);
  }),

  get: asyncHandler(async (req, res) => {
    const data = await groupTripService.getForUser(req.params.id, req.user.sub);
    response.success(res, data);
  }),

  delete: asyncHandler(async (req, res) => {
    const data = await groupTripService.delete(req.params.id, req.user.sub);
    response.success(res, data, 'Group trip deleted successfully');
  }),

  addItineraryItem: asyncHandler(async (req, res) => {
    const data = await groupTripService.addItineraryItem(req.params.id, req.user.sub, req.body);
    response.success(res, data, 'Itinerary item created', 201);
  }),

  updateItineraryItem: asyncHandler(async (req, res) => {
    const data = await groupTripService.updateItineraryItem(req.params.id, req.params.itemId, req.user.sub, req.body);
    response.success(res, data, 'Itinerary item updated');
  }),

  deleteItineraryItem: asyncHandler(async (req, res) => {
    const data = await groupTripService.deleteItineraryItem(req.params.id, req.params.itemId, req.user.sub);
    response.success(res, data, 'Itinerary item deleted');
  }),

  listMembers: asyncHandler(async (req, res) => {
    const data = await groupTripService.listMembers(req.params.id, req.user.sub, req.query);
    response.success(res, data);
  }),

  leave: asyncHandler(async (req, res) => {
    const data = await groupTripService.leave(req.params.id, req.user.sub);
    response.success(res, data, 'Left group trip');
  }),

  removeMember: asyncHandler(async (req, res) => {
    const data = await groupTripService.removeMember(req.params.id, req.params.userId, req.user.sub);
    response.success(res, data, 'Member removed');
  }),

  changeLeader: asyncHandler(async (req, res) => {
    const data = await groupTripService.changeLeader(req.params.id, req.body.user_id, req.user.sub);
    response.success(res, data, 'Group leader changed');
  }),

  updateSettings: asyncHandler(async (req, res) => {
    const data = await groupTripService.updateSettings(req.params.id, req.user.sub, req.body);
    response.success(res, data, 'Group trip settings updated');
  }),

  inviteMember: asyncHandler(async (req, res) => {
    const data = await groupTripService.inviteMember(req.params.id, req.user.sub, req.body);
    response.success(res, data, 'Invitation sent', 201);
  }),

  listInvitesForLeader: asyncHandler(async (req, res) => {
    const data = await groupTripService.listInvitesForLeader(req.params.id, req.user.sub, req.query);
    response.success(res, data, 'Group trip invitations retrieved');
  }),

  cancelInvite: asyncHandler(async (req, res) => {
    const data = await groupTripService.cancelInvite(req.params.id, req.params.inviteId, req.user.sub);
    response.success(res, data, 'Invitation revoked');
  }),

  listMyInvites: asyncHandler(async (req, res) => {
    const data = await groupTripService.listInvitesForUser(req.user.sub, req.query);
    response.success(res, data, 'Invitations retrieved');
  }),

  acceptInviteById: asyncHandler(async (req, res) => {
    const data = await groupTripService.acceptInviteById(req.params.inviteId, req.user.sub);
    response.success(res, data, 'Joined group trip');
  }),

  getInviteByToken: asyncHandler(async (req, res) => {
    const data = await groupTripService.getInviteByToken(req.params.token, req.user.sub);
    response.success(res, data, 'Invitation retrieved');
  }),

  declineInvite: asyncHandler(async (req, res) => {
    const data = await groupTripService.declineInvite(req.params.inviteId, req.user.sub);
    response.success(res, data, 'Invitation declined');
  }),

  acceptInvite: asyncHandler(async (req, res) => {
    const data = await groupTripService.acceptInvite(req.params.token, req.user.sub);
    response.success(res, data, 'Joined group trip');
  }),
};
