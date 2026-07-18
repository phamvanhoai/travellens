const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const groupTripService = require('../services/groupTrip.service');

module.exports = {
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

  acceptInvite: asyncHandler(async (req, res) => {
    const data = await groupTripService.acceptInvite(req.params.token, req.user.sub);
    response.success(res, data, 'Joined group trip');
  }),
};
