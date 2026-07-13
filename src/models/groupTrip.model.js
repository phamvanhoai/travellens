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
  gt.visibility,
  gt.leader_id,
  gt.created_by,
  gt.status,
  gt.created_at,
  gt.updated_at,
  b.tour_id,
  b.departure_at,
  b.status AS booking_status,
  b.payment_status,
  t.name AS tour_name,
  t.thumbnail AS tour_thumbnail
`;

module.exports = {
  getClient() {
    return db.getClient();
  },

  async create(payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO group_trip (booking_id, name, visibility, leader_id, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        payload.booking_id,
        payload.name,
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
       INNER JOIN booking b ON b.booking_id = gt.booking_id
       INNER JOIN tour t ON t.tour_id = b.tour_id
       WHERE gt.group_trip_id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async findByBookingId(bookingId, executor = db) {
    const result = await executor.query(
      'SELECT * FROM group_trip WHERE booking_id = $1',
      [bookingId]
    );
    return result.rows[0] || null;
  },

  async findForUpdate(id, executor) {
    const result = await executor.query(
      'SELECT * FROM group_trip WHERE group_trip_id = $1 FOR UPDATE',
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
    ];

    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`(gt.name ILIKE $${values.length} OR t.name ILIKE $${values.length})`);
    }

    const where = `WHERE ${clauses.join(' AND ')}`;
    const countResult = await executor.query(
      `SELECT COUNT(*)::int AS total
       FROM group_trip gt
       INNER JOIN booking b ON b.booking_id = gt.booking_id
       INNER JOIN tour t ON t.tour_id = b.tour_id
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
       INNER JOIN booking b ON b.booking_id = gt.booking_id
       INNER JOIN tour t ON t.tour_id = b.tour_id
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

  async updateSettings(id, payload, executor = db) {
    const fields = ['name', 'visibility'].filter((field) => payload[field] !== undefined);
    if (!fields.length) return this.findById(id, executor);

    const values = fields.map((field) => payload[field]);
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    values.push(id);
    const result = await executor.query(
      `UPDATE group_trip
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE group_trip_id = $${values.length}
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  async updateLeader(id, leaderId, executor = db) {
    const result = await executor.query(
      `UPDATE group_trip
       SET leader_id = $2, updated_at = CURRENT_TIMESTAMP
       WHERE group_trip_id = $1
       RETURNING *`,
      [id, leaderId]
    );
    return result.rows[0] || null;
  },

  async touch(id, executor = db) {
    await executor.query(
      'UPDATE group_trip SET updated_at = CURRENT_TIMESTAMP WHERE group_trip_id = $1',
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

  async findInviteByTokenHashForUpdate(tokenHash, executor) {
    const result = await executor.query(
      `SELECT gti.*, gt.name AS group_trip_name, gt.visibility, gt.leader_id
       FROM group_trip_invite gti
       INNER JOIN group_trip gt ON gt.group_trip_id = gti.group_trip_id
       WHERE gti.token_hash = $1
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
