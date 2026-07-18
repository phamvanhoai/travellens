const crypto = require('crypto');
const groupTripModel = require('../models/groupTrip.model');
const userModel = require('../models/user.model');
const travelDestinationModel = require('../models/travelDestination.model');
const locationModel = require('../models/location.model');
const emailService = require('./email.service');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const INVITE_EXPIRE_DAYS = Number(process.env.GROUP_TRIP_INVITE_EXPIRE_DAYS || 7);

class GroupTripService {
  toDateKey(value) {
    if (!value) return null;
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    return String(value).slice(0, 10);
  }

  serializeItineraryItem(item) {
    if (!item) return item;
    return {
      ...item,
      latitude: item.latitude === null || item.latitude === undefined ? null : Number(item.latitude),
      longitude: item.longitude === null || item.longitude === undefined ? null : Number(item.longitude),
    };
  }

  async normalizeItineraryLocation(payload, existing = null, executor) {
    if (payload.location_id !== undefined && payload.location_id !== null) {
      const location = await locationModel.findActiveById(payload.location_id, executor);
      if (!location) throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
      return {
        ...payload,
        custom_location: null,
        latitude: null,
        longitude: null,
      };
    }

    const customKeys = ['custom_location', 'latitude', 'longitude'];
    const switchesToCustom = payload.location_id === null || customKeys.some((key) => payload[key] !== undefined);
    if (!switchesToCustom) return payload;

    const customLocation = payload.custom_location ?? existing?.custom_location;
    const latitude = payload.latitude ?? existing?.latitude;
    const longitude = payload.longitude ?? existing?.longitude;
    if (!customLocation || latitude === null || latitude === undefined || longitude === null || longitude === undefined) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'custom_location, latitude, and longitude are required when location_id is not provided'
      );
    }
    return {
      ...payload,
      location_id: null,
      custom_location: customLocation,
      latitude: Number(latitude),
      longitude: Number(longitude),
    };
  }

  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  generateInviteToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  getInviteAcceptUrl(token) {
    const baseUrl = process.env.FRONTEND_URL
      || process.env.APP_FRONTEND_URL
      || process.env.CLIENT_URL
      || 'http://localhost:5173';
    return `${baseUrl.replace(/\/$/, '')}/group-trip-invites/accept?token=${token}`;
  }

  async create(userId, payload) {
    if (payload.destination_id) {
      const destination = await travelDestinationModel.findActiveById(payload.destination_id);
      if (!destination) throw new ApiError(httpStatus.NOT_FOUND, 'Travel destination not found');
    }

    const client = await groupTripModel.getClient();
    let groupTripId;
    try {
      await client.query('BEGIN');

      const trip = await groupTripModel.create({
        ...payload,
        leader_id: userId,
        created_by: userId,
      }, client);

      await groupTripModel.addMember({
        group_trip_id: trip.group_trip_id,
        user_id: userId,
        role: 'leader',
      }, client);

      await client.query('COMMIT');
      groupTripId = trip.group_trip_id;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    return this.getForUser(groupTripId, userId);
  }

  listForUser(userId, query = {}) {
    return groupTripModel.listForUser(userId, query);
  }

  async getForUser(groupTripId, userId) {
    const trip = await this.ensureViewable(groupTripId, userId);
    const members = await groupTripModel.listMembers(groupTripId, { limit: 100 });
    const itinerary = await groupTripModel.listItinerary(groupTripId);
    const visibleMembers = trip.current_member
      ? members.items
      : members.items.map(({ email, phone, ...member }) => member);
    return {
      ...trip,
      members: visibleMembers,
      member_count: members.pagination.total,
      itinerary: itinerary.map((item) => this.serializeItineraryItem(item)),
    };
  }

  async ensureTripExists(groupTripId) {
    const trip = await groupTripModel.findById(groupTripId);
    if (!trip || trip.status !== 'active') {
      throw new ApiError(httpStatus.NOT_FOUND, 'Group trip not found');
    }
    return trip;
  }

  async ensureViewable(groupTripId, userId) {
    const trip = await this.ensureTripExists(groupTripId);
    const member = await groupTripModel.findMember(groupTripId, userId);
    if (trip.visibility === 'private' && member?.status !== 'active') {
      throw new ApiError(httpStatus.FORBIDDEN, 'You are not a member of this private group trip');
    }
    return {
      ...trip,
      current_member: member?.status === 'active' ? member : null,
    };
  }

  async ensureActiveMember(groupTripId, userId) {
    const trip = await this.ensureTripExists(groupTripId);
    const member = await groupTripModel.findMember(groupTripId, userId);
    if (!member || member.status !== 'active') {
      throw new ApiError(httpStatus.FORBIDDEN, 'You are not an active member of this group trip');
    }
    return { trip, member };
  }

  async ensureLeader(groupTripId, userId) {
    const { trip, member } = await this.ensureActiveMember(groupTripId, userId);
    if (trip.leader_id !== userId || member.role !== 'leader') {
      throw new ApiError(httpStatus.FORBIDDEN, 'Only the group leader can perform this action');
    }
    return { trip, member };
  }

  async listMembers(groupTripId, userId, query = {}) {
    await this.ensureViewable(groupTripId, userId);
    return groupTripModel.listMembers(groupTripId, query);
  }

  async leave(groupTripId, userId) {
    const client = await groupTripModel.getClient();
    try {
      await client.query('BEGIN');
      const trip = await groupTripModel.findForUpdate(groupTripId, client);
      if (!trip || trip.status !== 'active') {
        throw new ApiError(httpStatus.NOT_FOUND, 'Group trip not found');
      }

      const member = await groupTripModel.findMember(groupTripId, userId, client);
      if (!member || member.status !== 'active') {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not an active member of this group trip');
      }

      if (trip.leader_id === userId || member.role === 'leader') {
        const activeMembers = await groupTripModel.countActiveMembers(groupTripId, client);
        if (activeMembers > 1) {
          throw new ApiError(httpStatus.CONFLICT, 'Transfer group leader before leaving the group trip');
        }
      }

      const left = await groupTripModel.markMemberLeft(groupTripId, userId, client);
      await groupTripModel.touch(groupTripId, client);
      await client.query('COMMIT');
      return left;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async removeMember(groupTripId, targetUserId, actorUserId) {
    if (targetUserId === actorUserId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Use leave group trip to remove yourself');
    }

    const client = await groupTripModel.getClient();
    try {
      await client.query('BEGIN');
      const trip = await groupTripModel.findForUpdate(groupTripId, client);
      if (!trip || trip.status !== 'active') {
        throw new ApiError(httpStatus.NOT_FOUND, 'Group trip not found');
      }

      const leader = await groupTripModel.findMember(groupTripId, actorUserId, client);
      if (!leader || leader.status !== 'active' || leader.role !== 'leader' || trip.leader_id !== actorUserId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Only the group leader can remove members');
      }

      const target = await groupTripModel.findMember(groupTripId, targetUserId, client);
      if (!target || target.status !== 'active') {
        throw new ApiError(httpStatus.NOT_FOUND, 'Member not found');
      }
      if (target.role === 'leader' || trip.leader_id === targetUserId) {
        throw new ApiError(httpStatus.CONFLICT, 'Change group leader before removing this member');
      }

      const removed = await groupTripModel.markMemberRemoved(groupTripId, targetUserId, actorUserId, client);
      await groupTripModel.touch(groupTripId, client);
      await client.query('COMMIT');
      return removed;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async changeLeader(groupTripId, newLeaderId, actorUserId) {
    const client = await groupTripModel.getClient();
    try {
      await client.query('BEGIN');
      const trip = await groupTripModel.findForUpdate(groupTripId, client);
      if (!trip || trip.status !== 'active') {
        throw new ApiError(httpStatus.NOT_FOUND, 'Group trip not found');
      }

      const currentLeader = await groupTripModel.findMember(groupTripId, actorUserId, client);
      if (!currentLeader || currentLeader.status !== 'active' || currentLeader.role !== 'leader' || trip.leader_id !== actorUserId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Only the group leader can change group leader');
      }

      const nextLeader = await groupTripModel.findMember(groupTripId, newLeaderId, client);
      if (!nextLeader || nextLeader.status !== 'active') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'New leader must be an active member of this group trip');
      }

      await groupTripModel.setMemberRole(groupTripId, actorUserId, 'member', client);
      await groupTripModel.setMemberRole(groupTripId, newLeaderId, 'leader', client);
      const updated = await groupTripModel.updateLeader(groupTripId, newLeaderId, client);
      await client.query('COMMIT');
      return updated;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateSettings(groupTripId, actorUserId, payload) {
    if (payload.destination_id) {
      const destination = await travelDestinationModel.findActiveById(payload.destination_id);
      if (!destination) throw new ApiError(httpStatus.NOT_FOUND, 'Travel destination not found');
    }

    const client = await groupTripModel.getClient();
    try {
      await client.query('BEGIN');
      const trip = await groupTripModel.findForUpdate(groupTripId, client);
      if (!trip || trip.status !== 'active') throw new ApiError(httpStatus.NOT_FOUND, 'Group trip not found');
      const leader = await groupTripModel.findMember(groupTripId, actorUserId, client);
      if (!leader || leader.status !== 'active' || leader.role !== 'leader' || trip.leader_id !== actorUserId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Only the group leader can perform this action');
      }
      const startDate = payload.start_date || trip.start_date;
      const endDate = payload.end_date || trip.end_date;
      if (startDate && endDate && this.toDateKey(endDate) < this.toDateKey(startDate)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'End date must be on or after start date');
      }
      if (payload.max_members) {
        const activeMembers = await groupTripModel.countActiveMembers(groupTripId, client);
        if (payload.max_members < activeMembers) {
          throw new ApiError(httpStatus.CONFLICT, 'Max members cannot be lower than the active member count');
        }
      }
      await groupTripModel.updateSettings(groupTripId, payload, client);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    return this.getForUser(groupTripId, actorUserId);
  }

  assertItineraryDate(trip, itineraryDate) {
    const value = this.toDateKey(itineraryDate);
    const start = this.toDateKey(trip.start_date);
    const end = this.toDateKey(trip.end_date);
    if ((start && value < start) || (end && value > end)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Itinerary date must be within the group trip date range');
    }
  }

  async addItineraryItem(groupTripId, actorUserId, payload) {
    const { trip } = await this.ensureLeader(groupTripId, actorUserId);
    this.assertItineraryDate(trip, payload.itinerary_date);
    const normalizedPayload = await this.normalizeItineraryLocation(payload);
    const item = await groupTripModel.createItineraryItem(groupTripId, normalizedPayload);
    await groupTripModel.touch(groupTripId);
    return this.serializeItineraryItem(item);
  }

  async updateItineraryItem(groupTripId, itemId, actorUserId, payload) {
    const client = await groupTripModel.getClient();
    try {
      await client.query('BEGIN');
      const trip = await groupTripModel.findForUpdate(groupTripId, client);
      if (!trip || trip.status !== 'active') throw new ApiError(httpStatus.NOT_FOUND, 'Group trip not found');
      const leader = await groupTripModel.findMember(groupTripId, actorUserId, client);
      if (!leader || leader.status !== 'active' || leader.role !== 'leader' || trip.leader_id !== actorUserId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Only the group leader can edit the itinerary');
      }
      const existing = await groupTripModel.findItineraryItemForUpdate(groupTripId, itemId, client);
      if (!existing) throw new ApiError(httpStatus.NOT_FOUND, 'Itinerary item not found');
      this.assertItineraryDate(trip, payload.itinerary_date || existing.itinerary_date);
      const normalizedPayload = await this.normalizeItineraryLocation(payload, existing, client);
      const item = await groupTripModel.updateItineraryItem(itemId, normalizedPayload, client);
      await groupTripModel.touch(groupTripId, client);
      await client.query('COMMIT');
      return this.serializeItineraryItem(item);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteItineraryItem(groupTripId, itemId, actorUserId) {
    const client = await groupTripModel.getClient();
    try {
      await client.query('BEGIN');
      const trip = await groupTripModel.findForUpdate(groupTripId, client);
      if (!trip || trip.status !== 'active') throw new ApiError(httpStatus.NOT_FOUND, 'Group trip not found');
      const leader = await groupTripModel.findMember(groupTripId, actorUserId, client);
      if (!leader || leader.status !== 'active' || leader.role !== 'leader' || trip.leader_id !== actorUserId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Only the group leader can edit the itinerary');
      }
      const existing = await groupTripModel.findItineraryItemForUpdate(groupTripId, itemId, client);
      if (!existing) throw new ApiError(httpStatus.NOT_FOUND, 'Itinerary item not found');
      const deleted = await groupTripModel.deleteItineraryItem(itemId, client);
      await groupTripModel.touch(groupTripId, client);
      await client.query('COMMIT');
      return { ...deleted, deleted: true };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(groupTripId, actorUserId) {
    const client = await groupTripModel.getClient();
    try {
      await client.query('BEGIN');

      const trip = await groupTripModel.findForUpdate(groupTripId, client);
      if (!trip) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Group trip not found');
      }
      if (trip.status !== 'active') {
        throw new ApiError(httpStatus.CONFLICT, 'Group trip has already been deleted');
      }

      const leader = await groupTripModel.findMember(groupTripId, actorUserId, client);
      if (!leader || leader.status !== 'active' || leader.role !== 'leader' || trip.leader_id !== actorUserId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Only the group leader can delete this group trip');
      }

      const archived = await groupTripModel.archive(groupTripId, client);
      const canceledInvites = await groupTripModel.cancelPendingInvites(groupTripId, client);

      await client.query('COMMIT');
      return {
        group_trip_id: archived.group_trip_id,
        status: archived.status,
        canceled_invites_count: canceledInvites.length,
        deleted: true,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async inviteMember(groupTripId, actorUserId, payload) {
    const invitedEmail = payload.email.toLowerCase().trim();
    const client = await groupTripModel.getClient();
    let invite;
    let invitedUser;
    let trip;
    let token;

    try {
      await client.query('BEGIN');
      trip = await groupTripModel.findForUpdate(groupTripId, client);
      if (!trip || trip.status !== 'active') {
        throw new ApiError(httpStatus.NOT_FOUND, 'Group trip not found');
      }

      const leader = await groupTripModel.findMember(groupTripId, actorUserId, client);
      if (!leader || leader.status !== 'active' || leader.role !== 'leader' || trip.leader_id !== actorUserId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Only the group leader can invite members');
      }

      invitedUser = await userModel.findByEmailForStaffLookup(invitedEmail, client);
      if (!invitedUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Invited customer account not found');
      }
      if (invitedUser.role !== 'customer' || invitedUser.status !== 'active') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invited account must be an active customer');
      }
      if (invitedUser.user_id === actorUserId) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You are already the group leader');
      }

      const existingMember = await groupTripModel.findMember(groupTripId, invitedUser.user_id, client);
      if (existingMember?.status === 'active') {
        throw new ApiError(httpStatus.CONFLICT, 'Customer is already a group member');
      }

      const existingInvite = await groupTripModel.findPendingInvite(groupTripId, invitedUser.user_id, client);
      if (existingInvite) {
        throw new ApiError(httpStatus.CONFLICT, 'Customer already has a pending invitation');
      }

      token = this.generateInviteToken();
      const expiresAt = new Date(Date.now() + INVITE_EXPIRE_DAYS * 24 * 60 * 60 * 1000);
      invite = await groupTripModel.createInvite({
        group_trip_id: groupTripId,
        invited_user_id: invitedUser.user_id,
        invited_email: invitedUser.email,
        invited_by: actorUserId,
        token_hash: this.hashToken(token),
        expires_at: expiresAt,
      }, client);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    const acceptUrl = this.getInviteAcceptUrl(token);
    const tripForEmail = await groupTripModel.findById(groupTripId) || trip;
    const emailResult = await emailService.sendBestEffort(() => emailService.sendGroupTripInvite({
      to: invitedUser.email,
      name: invitedUser.name,
      groupTrip: tripForEmail,
      acceptUrl,
      expiresAt: invite.expires_at,
    }), logger);

    return {
      group_trip_invite_id: invite.group_trip_invite_id,
      group_trip_id: invite.group_trip_id,
      invited_user_id: invite.invited_user_id,
      invited_email: invite.invited_email,
      status: invite.status,
      expires_at: invite.expires_at,
      email_sent: Boolean(emailResult),
    };
  }

  async acceptInvite(token, userId) {
    const tokenHash = this.hashToken(token);
    const client = await groupTripModel.getClient();
    let groupTripId;
    try {
      await client.query('BEGIN');
      const invite = await groupTripModel.findInviteByTokenHashForUpdate(tokenHash, client);
      if (!invite) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Invitation not found');
      }
      if (invite.status !== 'pending') {
        throw new ApiError(httpStatus.BAD_REQUEST, `Invitation is already ${invite.status}`);
      }
      if (invite.group_trip_status !== 'active') {
        throw new ApiError(httpStatus.CONFLICT, 'Group trip is no longer active');
      }
      if (new Date(invite.expires_at).getTime() <= Date.now()) {
        await client.query(
          "UPDATE group_trip_invite SET status = 'expired' WHERE group_trip_invite_id = $1",
          [invite.group_trip_invite_id]
        );
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invitation has expired');
      }
      if (invite.invited_user_id !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'This invitation belongs to another customer account');
      }

      const customer = await userModel.findActiveCustomerById(userId, client);
      if (!customer) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Only active customer accounts can accept group trip invitations');
      }

      const existingMember = await groupTripModel.findMember(invite.group_trip_id, userId, client);
      if (existingMember?.status === 'active') {
        await groupTripModel.markInviteAccepted(invite.group_trip_invite_id, client);
        await client.query('COMMIT');
        groupTripId = invite.group_trip_id;
      } else {
        if (invite.max_members) {
          const activeMembers = await groupTripModel.countActiveMembers(invite.group_trip_id, client);
          if (activeMembers >= invite.max_members) {
            throw new ApiError(httpStatus.CONFLICT, 'Group trip has reached its member limit');
          }
        }
        await groupTripModel.addMember({
          group_trip_id: invite.group_trip_id,
          user_id: userId,
          role: 'member',
        }, client);
        await groupTripModel.markInviteAccepted(invite.group_trip_invite_id, client);
        await groupTripModel.touch(invite.group_trip_id, client);

        await client.query('COMMIT');
        groupTripId = invite.group_trip_id;
      }
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    return this.getForUser(groupTripId, userId);
  }
}

module.exports = new GroupTripService();
