const db = require('../config/db');

const MEMBER_SELECT = `
  gtm.group_trip_member_id,
  gtm.group_trip_id,
  gtm.user_id,
  gtm.role,
  gtm.status,
  gtm.joined_at,
  gtm.left_at,
  gtm.removed_at,
  gtm.removed_by,
  u.name,
  u.email,
  u.phone,
  u.avatar_url
`;

const TRIP_SELECT = `
  gt.group_trip_id,
  gt.booking_id,
  gt.name,
  gt.description,
  gt.destination_id,
  COALESCE(td.name, gt.destination_name) AS destination_name,
  gt.start_date,
  gt.end_date,
  gt.max_members,
  gt.visibility,
  gt.leader_id,
  gt.created_by,
  gt.status,
  gt.created_at,
  gt.updated_at
`;

module.exports = {
  getClient() {
    return db.getClient();
  },

  async create(payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO group_trip
         (name, description, destination_id, destination_name, start_date, end_date,
          max_members, visibility, leader_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        payload.name,
        payload.description || null,
        payload.destination_id || null,
        payload.destination_name || null,
        payload.start_date,
        payload.end_date,
        payload.max_members || null,
        payload.visibility || 'private',
        payload.leader_id,
        payload.created_by,
      ]
    );
    return result.rows[0];
  },

  async findById(id, executor = db) {
    const result = await executor.query(
      `SELECT ${TRIP_SELECT}
       FROM group_trip gt
       LEFT JOIN travel_destination td ON td.destination_id = gt.destination_id
       WHERE gt.group_trip_id = $1
         AND gt.deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] || null;
  },

  async findByBookingId(bookingId, executor = db) {
    const result = await executor.query(
      'SELECT * FROM group_trip WHERE booking_id = $1 AND deleted_at IS NULL',
      [bookingId]
    );
    return result.rows[0] || null;
  },

  async findForUpdate(id, executor) {
    const result = await executor.query(
      'SELECT * FROM group_trip WHERE group_trip_id = $1 AND deleted_at IS NULL FOR UPDATE',
      [id]
    );
    return result.rows[0] || null;
  },

  async listForUser(userId, query = {}, executor = db) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;
    const values = [userId];
    const clauses = [
      `EXISTS (
        SELECT 1
        FROM group_trip_member gtm
        WHERE gtm.group_trip_id = gt.group_trip_id
          AND gtm.user_id = $1
          AND gtm.status = 'active'
      )`,
      "gt.status = 'active'",
      'gt.deleted_at IS NULL',
    ];

    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`(gt.name ILIKE $${values.length} OR gt.destination_name ILIKE $${values.length} OR td.name ILIKE $${values.length})`);
    }

    const where = `WHERE ${clauses.join(' AND ')}`;
    const countResult = await executor.query(
      `SELECT COUNT(*)::int AS total
       FROM group_trip gt
       LEFT JOIN travel_destination td ON td.destination_id = gt.destination_id
       ${where}`,
      values
    );

    const listValues = [...values, limit, offset];
    const result = await executor.query(
      `SELECT ${TRIP_SELECT},
              (
                SELECT COUNT(*)::int
                FROM group_trip_member member_count
                WHERE member_count.group_trip_id = gt.group_trip_id
                  AND member_count.status = 'active'
              ) AS member_count
       FROM group_trip gt
       LEFT JOIN travel_destination td ON td.destination_id = gt.destination_id
       ${where}
       ORDER BY gt.updated_at DESC, gt.group_trip_id DESC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues
    );

    const total = countResult.rows[0].total;
    return {
      items: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async listForAdmin(query = {}, executor = db) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;
    const values = [];
    const clauses = ['gt.deleted_at IS NULL'];

    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`(gt.name ILIKE $${values.length} OR gt.destination_name ILIKE $${values.length} OR td.name ILIKE $${values.length})`);
    }
    if (query.visibility) {
      values.push(query.visibility);
      clauses.push(`gt.visibility = $${values.length}`);
    }
    if (query.status) {
      values.push(query.status);
      clauses.push(`gt.status = $${values.length}`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const countResult = await executor.query(
      `SELECT COUNT(*)::int AS total
       FROM group_trip gt
       LEFT JOIN travel_destination td ON td.destination_id = gt.destination_id
       ${where}`,
      values
    );
    const listValues = [...values, limit, offset];
    const result = await executor.query(
      `SELECT ${TRIP_SELECT},
              json_build_object('user_id', leader.user_id, 'name', leader.name,
                'email', leader.email, 'avatar_url', leader.avatar_url) AS leader,
              (SELECT COUNT(*)::int FROM group_trip_member gtm
               WHERE gtm.group_trip_id = gt.group_trip_id AND gtm.status = 'active') AS member_count
       FROM group_trip gt
       JOIN users leader ON leader.user_id = gt.leader_id
       LEFT JOIN travel_destination td ON td.destination_id = gt.destination_id
       ${where}
       ORDER BY gt.updated_at DESC, gt.group_trip_id DESC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues
    );
    const total = Number(countResult.rows[0].total || 0);
    return {
      items: result.rows,
      pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
    };
  },

  async updateSettings(id, payload, executor = db) {
    const fields = [
      'name', 'description', 'destination_id', 'destination_name',
      'start_date', 'end_date', 'max_members', 'visibility',
    ].filter((field) => payload[field] !== undefined);
    if (!fields.length) return this.findById(id, executor);

    const values = fields.map((field) => payload[field]);
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    values.push(id);
    const result = await executor.query(
      `UPDATE group_trip
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE group_trip_id = $${values.length}
         AND deleted_at IS NULL
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async listPublic(query = {}, executor = db) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;
    const values = [];
    const clauses = ["gt.status = 'active'", "gt.visibility = 'public'", 'gt.deleted_at IS NULL'];
    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`(gt.name ILIKE $${values.length} OR gt.destination_name ILIKE $${values.length} OR td.name ILIKE $${values.length})`);
    }
    const where = `WHERE ${clauses.join(' AND ')}`;
    const count = await executor.query(
      `SELECT COUNT(*)::int AS total
       FROM group_trip gt
       LEFT JOIN travel_destination td ON td.destination_id = gt.destination_id
       ${where}`,
      values
    );
    const listValues = [...values, limit, offset];
    const result = await executor.query(
      `SELECT gt.group_trip_id, gt.name, gt.description, gt.destination_id,
              COALESCE(td.name, gt.destination_name) AS destination_name,
              gt.start_date, gt.end_date, gt.max_members, gt.visibility,
              gt.created_at, gt.updated_at,
              json_build_object('user_id', leader.user_id, 'name', leader.name,
                'avatar_url', leader.avatar_url) AS leader,
              (SELECT COUNT(*)::int FROM group_trip_member gtm
               WHERE gtm.group_trip_id = gt.group_trip_id AND gtm.status = 'active') AS member_count
       FROM group_trip gt
       JOIN users leader ON leader.user_id = gt.leader_id
       LEFT JOIN travel_destination td ON td.destination_id = gt.destination_id
       ${where}
       ORDER BY gt.start_date ASC NULLS LAST, gt.updated_at DESC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues
    );
    const total = count.rows[0].total;
    return { items: result.rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  async findPublicById(id, executor = db) {
    const result = await executor.query(
      `SELECT gt.group_trip_id, gt.name, gt.description, gt.destination_id,
              COALESCE(td.name, gt.destination_name) AS destination_name,
              gt.start_date, gt.end_date, gt.max_members, gt.visibility,
              gt.created_at, gt.updated_at,
              json_build_object('user_id', leader.user_id, 'name', leader.name,
                'avatar_url', leader.avatar_url) AS leader,
              (SELECT COUNT(*)::int FROM group_trip_member gtm
               WHERE gtm.group_trip_id = gt.group_trip_id AND gtm.status = 'active') AS member_count
       FROM group_trip gt
       JOIN users leader ON leader.user_id = gt.leader_id
       LEFT JOIN travel_destination td ON td.destination_id = gt.destination_id
       WHERE gt.group_trip_id = $1
         AND gt.status = 'active'
         AND gt.visibility = 'public'
         AND gt.deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] || null;
  },

  async archive(id, executor = db) {
    const result = await executor.query(
      `UPDATE group_trip
       SET status = 'archived',
           updated_at = CURRENT_TIMESTAMP
       WHERE group_trip_id = $1
         AND status = 'active'
         AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  },

  async softDelete(id, executor = db) {
    const result = await executor.query(
      `UPDATE group_trip
       SET deleted_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE group_trip_id = $1
         AND deleted_at IS NULL
       RETURNING group_trip_id, deleted_at`,
      [id]
    );
    return result.rows[0] || null;
  },

  async cancelPendingInvites(groupTripId, executor = db) {
    const result = await executor.query(
      `UPDATE group_trip_invite
       SET status = 'canceled',
           canceled_at = CURRENT_TIMESTAMP
       WHERE group_trip_id = $1
         AND status = 'pending'
       RETURNING group_trip_invite_id`,
      [groupTripId]
    );
    return result.rows;
  },

  async updateLeader(id, leaderId, executor = db) {
    const result = await executor.query(
      `UPDATE group_trip
       SET leader_id = $2, updated_at = CURRENT_TIMESTAMP
       WHERE group_trip_id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id, leaderId]
    );
    return result.rows[0] || null;
  },

  async touch(id, executor = db) {
    await executor.query(
      'UPDATE group_trip SET updated_at = CURRENT_TIMESTAMP WHERE group_trip_id = $1 AND deleted_at IS NULL',
      [id]
    );
  },

  async addMember(payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO group_trip_member (group_trip_id, user_id, role, status)
       VALUES ($1, $2, $3, 'active')
       ON CONFLICT (group_trip_id, user_id)
       DO UPDATE SET
         role = EXCLUDED.role,
         status = 'active',
         joined_at = CURRENT_TIMESTAMP,
         left_at = NULL,
         removed_at = NULL,
         removed_by = NULL
       RETURNING *`,
      [payload.group_trip_id, payload.user_id, payload.role || 'member']
    );
    return result.rows[0];
  },

  async findMember(groupTripId, userId, executor = db) {
    const result = await executor.query(
      `SELECT ${MEMBER_SELECT}
       FROM group_trip_member gtm
       INNER JOIN users u ON u.user_id = gtm.user_id
       WHERE gtm.group_trip_id = $1
         AND gtm.user_id = $2`,
      [groupTripId, userId]
    );
    return result.rows[0] || null;
  },

  async listMembers(groupTripId, query = {}, executor = db) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;
    const values = [groupTripId];
    const clauses = ['gtm.group_trip_id = $1', "gtm.status = 'active'"];

    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`(u.name ILIKE $${values.length} OR u.email ILIKE $${values.length} OR u.phone ILIKE $${values.length})`);
    }

    const where = `WHERE ${clauses.join(' AND ')}`;
    const countResult = await executor.query(
      `SELECT COUNT(*)::int AS total
       FROM group_trip_member gtm
       INNER JOIN users u ON u.user_id = gtm.user_id
       ${where}`,
      values
    );

    const listValues = [...values, limit, offset];
    const result = await executor.query(
      `SELECT ${MEMBER_SELECT}
       FROM group_trip_member gtm
       INNER JOIN users u ON u.user_id = gtm.user_id
       ${where}
       ORDER BY
         CASE WHEN gtm.role = 'leader' THEN 0 ELSE 1 END,
         gtm.joined_at ASC,
         gtm.group_trip_member_id ASC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues
    );

    const total = countResult.rows[0].total;
    return {
      items: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async countActiveMembers(groupTripId, executor = db) {
    const result = await executor.query(
      `SELECT COUNT(*)::int AS total
       FROM group_trip_member
       WHERE group_trip_id = $1
         AND status = 'active'`,
      [groupTripId]
    );
    return Number(result.rows[0].total || 0);
  },

  async markMemberLeft(groupTripId, userId, executor = db) {
    const result = await executor.query(
      `UPDATE group_trip_member
       SET status = 'left',
           role = 'member',
           left_at = CURRENT_TIMESTAMP
       WHERE group_trip_id = $1
         AND user_id = $2
         AND status = 'active'
       RETURNING *`,
      [groupTripId, userId]
    );
    return result.rows[0] || null;
  },

  async markMemberRemoved(groupTripId, userId, removedBy, executor = db) {
    const result = await executor.query(
      `UPDATE group_trip_member
       SET status = 'removed',
           role = 'member',
           removed_at = CURRENT_TIMESTAMP,
           removed_by = $3
       WHERE group_trip_id = $1
         AND user_id = $2
         AND status = 'active'
       RETURNING *`,
      [groupTripId, userId, removedBy]
    );
    return result.rows[0] || null;
  },

  async setMemberRole(groupTripId, userId, role, executor = db) {
    const result = await executor.query(
      `UPDATE group_trip_member
       SET role = $3
       WHERE group_trip_id = $1
         AND user_id = $2
         AND status = 'active'
       RETURNING *`,
      [groupTripId, userId, role]
    );
    return result.rows[0] || null;
  },

  async listItinerary(groupTripId, executor = db) {
    const result = await executor.query(
      `SELECT gtii.*,
              gtii.latitude::float8 AS latitude,
              gtii.longitude::float8 AS longitude,
              l.name AS location_name
       FROM group_trip_itinerary_item gtii
       LEFT JOIN location l ON l.location_id = gtii.location_id
       WHERE gtii.group_trip_id = $1
       ORDER BY gtii.itinerary_date ASC, gtii.order_index ASC, gtii.start_time ASC NULLS LAST,
                gtii.itinerary_item_id ASC`,
      [groupTripId]
    );
    return result.rows;
  },

  async createItineraryItem(groupTripId, payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO group_trip_itinerary_item
         (group_trip_id, itinerary_date, start_time, title, description, location_id,
          custom_location, latitude, longitude, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [groupTripId, payload.itinerary_date, payload.start_time || null, payload.title,
        payload.description || null, payload.location_id || null, payload.custom_location || null,
        payload.latitude ?? null, payload.longitude ?? null, payload.order_index || 0]
    );
    return result.rows[0];
  },

  async findItineraryItemForUpdate(groupTripId, itemId, executor) {
    const result = await executor.query(
      `SELECT * FROM group_trip_itinerary_item
       WHERE group_trip_id = $1 AND itinerary_item_id = $2
       FOR UPDATE`,
      [groupTripId, itemId]
    );
    return result.rows[0] || null;
  },

  async updateItineraryItem(itemId, payload, executor = db) {
    const fields = [
      'itinerary_date', 'start_time', 'title', 'description',
      'location_id', 'custom_location', 'latitude', 'longitude', 'order_index',
    ].filter((field) => payload[field] !== undefined);
    const values = fields.map((field) => payload[field]);
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    values.push(itemId);
    const result = await executor.query(
      `UPDATE group_trip_itinerary_item
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE itinerary_item_id = $${values.length}
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async deleteItineraryItem(itemId, executor = db) {
    const result = await executor.query(
      `DELETE FROM group_trip_itinerary_item
       WHERE itinerary_item_id = $1
       RETURNING itinerary_item_id, group_trip_id`,
      [itemId]
    );
    return result.rows[0] || null;
  },

  async createInvite(payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO group_trip_invite
         (group_trip_id, invited_user_id, invited_email, invited_by, token_hash, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        payload.group_trip_id,
        payload.invited_user_id,
        payload.invited_email,
        payload.invited_by,
        payload.token_hash,
        payload.expires_at,
      ]
    );
    return result.rows[0];
  },

  async findPendingInvite(groupTripId, invitedUserId, executor = db) {
    const result = await executor.query(
      `SELECT *
       FROM group_trip_invite
       WHERE group_trip_id = $1
         AND invited_user_id = $2
         AND status = 'pending'
       ORDER BY group_trip_invite_id DESC
       LIMIT 1`,
      [groupTripId, invitedUserId]
    );
    return result.rows[0] || null;
  },

  async expirePendingInvites(executor = db) {
    await executor.query(
      `UPDATE group_trip_invite
       SET status = 'expired'
       WHERE status = 'pending'
         AND expires_at <= CURRENT_TIMESTAMP`
    );
  },

  async listInvitesForLeader(groupTripId, query = {}, executor = db) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;
    const values = [groupTripId];
    const clauses = ['gti.group_trip_id = $1'];
    if (query.status) {
      values.push(query.status);
      clauses.push(`gti.status = $${values.length}`);
    }
    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`(u.name ILIKE $${values.length} OR u.email ILIKE $${values.length})`);
    }
    const where = `WHERE ${clauses.join(' AND ')}`;
    const count = await executor.query(
      `SELECT COUNT(*)::int AS total
       FROM group_trip_invite gti
       JOIN users u ON u.user_id = gti.invited_user_id
       ${where}`,
      values
    );
    const listValues = [...values, limit, offset];
    const result = await executor.query(
      `SELECT gti.group_trip_invite_id, gti.group_trip_id, gti.invited_user_id,
              gti.invited_email, gti.status, gti.expires_at, gti.accepted_at,
              gti.canceled_at, gti.declined_at, gti.created_at,
              json_build_object('user_id', u.user_id, 'name', u.name,
                'email', u.email, 'avatar_url', u.avatar_url) AS invited_user
       FROM group_trip_invite gti
       JOIN users u ON u.user_id = gti.invited_user_id
       ${where}
       ORDER BY gti.created_at DESC, gti.group_trip_invite_id DESC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues
    );
    const total = count.rows[0].total;
    return { items: result.rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  async listInvitesForUser(userId, query = {}, executor = db) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;
    const values = [userId];
    const clauses = ['gti.invited_user_id = $1', 'gt.deleted_at IS NULL'];
    if (query.status) {
      values.push(query.status);
      clauses.push(`gti.status = $${values.length}`);
    }
    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`(gt.name ILIKE $${values.length} OR inviter.name ILIKE $${values.length})`);
    }
    const where = `WHERE ${clauses.join(' AND ')}`;
    const count = await executor.query(
      `SELECT COUNT(*)::int AS total
       FROM group_trip_invite gti
       JOIN group_trip gt ON gt.group_trip_id = gti.group_trip_id
       JOIN users inviter ON inviter.user_id = gti.invited_by
       ${where}`,
      values
    );
    const listValues = [...values, limit, offset];
    const result = await executor.query(
      `SELECT gti.group_trip_invite_id, gti.group_trip_id, gti.status,
              gti.expires_at, gti.accepted_at, gti.canceled_at, gti.declined_at,
              gti.created_at,
              json_build_object('group_trip_id', gt.group_trip_id, 'name', gt.name,
                'description', gt.description, 'destination_name', gt.destination_name,
                'start_date', gt.start_date, 'end_date', gt.end_date,
                'visibility', gt.visibility, 'status', gt.status) AS group_trip,
              json_build_object('user_id', inviter.user_id, 'name', inviter.name,
                'avatar_url', inviter.avatar_url) AS invited_by
       FROM group_trip_invite gti
       JOIN group_trip gt ON gt.group_trip_id = gti.group_trip_id
       JOIN users inviter ON inviter.user_id = gti.invited_by
       ${where}
       ORDER BY CASE WHEN gti.status = 'pending' THEN 0 ELSE 1 END,
                gti.created_at DESC, gti.group_trip_invite_id DESC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues
    );
    const total = count.rows[0].total;
    return { items: result.rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  async findInviteByIdForUpdate(inviteId, executor) {
    const result = await executor.query(
      `SELECT gti.*, gt.name AS group_trip_name, gt.visibility, gt.leader_id,
              gt.status AS group_trip_status, gt.max_members
       FROM group_trip_invite gti
       JOIN group_trip gt ON gt.group_trip_id = gti.group_trip_id
       WHERE gti.group_trip_invite_id = $1
         AND gt.deleted_at IS NULL
       FOR UPDATE OF gti`,
      [inviteId]
    );
    return result.rows[0] || null;
  },

  async cancelInvite(inviteId, executor = db) {
    const result = await executor.query(
      `UPDATE group_trip_invite
       SET status = 'canceled', canceled_at = CURRENT_TIMESTAMP
       WHERE group_trip_invite_id = $1 AND status = 'pending'
       RETURNING *`,
      [inviteId]
    );
    return result.rows[0] || null;
  },

  async declineInvite(inviteId, executor = db) {
    const result = await executor.query(
      `UPDATE group_trip_invite
       SET status = 'declined', declined_at = CURRENT_TIMESTAMP
       WHERE group_trip_invite_id = $1 AND status = 'pending'
       RETURNING *`,
      [inviteId]
    );
    return result.rows[0] || null;
  },

  async findInviteByTokenHashForUpdate(tokenHash, executor) {
    const result = await executor.query(
      `SELECT gti.*, gt.name AS group_trip_name, gt.visibility, gt.leader_id,
              gt.status AS group_trip_status, gt.max_members, gt.description AS group_trip_description,
              gt.destination_name, gt.start_date, gt.end_date
       FROM group_trip_invite gti
       INNER JOIN group_trip gt ON gt.group_trip_id = gti.group_trip_id
       WHERE gti.token_hash = $1
         AND gt.deleted_at IS NULL
       FOR UPDATE OF gti`,
      [tokenHash]
    );
    return result.rows[0] || null;
  },

  async markInviteAccepted(inviteId, executor = db) {
    const result = await executor.query(
      `UPDATE group_trip_invite
       SET status = 'accepted',
           accepted_at = CURRENT_TIMESTAMP
       WHERE group_trip_invite_id = $1
       RETURNING *`,
      [inviteId]
    );
    return result.rows[0] || null;
  },
};
