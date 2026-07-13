const crypto = require('crypto');
const groupTripModel = require('../models/groupTrip.model');
const bookingModel = require('../models/booking.model');
const userModel = require('../models/user.model');
const emailService = require('./email.service');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const INVITE_EXPIRE_DAYS = Number(process.env.GROUP_TRIP_INVITE_EXPIRE_DAYS || 7);

class GroupTripService {
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

  async createForBooking(userId, payload) {
    const client = await groupTripModel.getClient();
    let groupTripId;
    try {
      await client.query('BEGIN');

      const booking = await bookingModel.findOwnedById(payload.booking_id, userId, client);
      if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
      }
      if (['canceled', 'expired'].includes(booking.status)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot create group trip for canceled or expired booking');
      }

      const existing = await groupTripModel.findByBookingId(payload.booking_id, client);
      if (existing) {
        throw new ApiError(httpStatus.CONFLICT, 'Group trip already exists for this booking');
      }

      const trip = await groupTripModel.create({
        booking_id: payload.booking_id,
        name: payload.name,
        visibility: payload.visibility,
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
    return {
      ...trip,
      members: members.items,
      member_count: members.pagination.total,
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
    await this.ensureLeader(groupTripId, actorUserId);
    const updated = await groupTripModel.updateSettings(groupTripId, payload);
    if (!updated) throw new ApiError(httpStatus.NOT_FOUND, 'Group trip not found');
    return this.getForUser(groupTripId, actorUserId);
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
