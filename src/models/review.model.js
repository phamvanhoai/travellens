const db = require('../config/db');
const BaseModel = require('./base.model');

class ReviewModel extends BaseModel {
  constructor() {
    super({
      table: 'review',
      primaryKey: 'review_id',
      fields: ['user_id', 'location_id', 'booking_id', 'tour_id', 'rating', 'comment', 'images', 'status'],
      searchable: ['comment'],
      filters: ['user_id', 'location_id', 'booking_id', 'tour_id', 'rating', 'status'],
    });
  }

  async createLocationReview({ userId, locationId, rating, comment, status = 'approved' }) {
    const result = await db.query(
      `INSERT INTO review (user_id, location_id, rating, comment, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING review_id, location_id, rating, comment, status, created_at`,
      [userId, locationId, rating, comment || null, status]
    );

    return result.rows[0];
  }

  async createTourReview({ userId, bookingId, tourId, rating, comment, status = 'approved' }) {
    const result = await db.query(
      `INSERT INTO review (user_id, booking_id, tour_id, rating, comment, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING review_id, booking_id, tour_id, user_id, rating, comment, status, created_at`,
      [userId, bookingId, tourId, rating, comment || null, status]
    );

    return result.rows[0];
  }

  async findActiveByUserAndLocation(userId, locationId) {
    const result = await db.query(
      `SELECT review_id
       FROM review
       WHERE user_id = $1
         AND location_id = $2
         AND deleted_at IS NULL
       LIMIT 1`,
      [userId, locationId]
    );

    return result.rows[0] || null;
  }

  async findActiveByBooking(bookingId) {
    const result = await db.query(
      `SELECT review_id
       FROM review
       WHERE booking_id = $1
         AND deleted_at IS NULL
       LIMIT 1`,
      [bookingId]
    );

    return result.rows[0] || null;
  }

  async softDelete(id) {
    const result = await db.query(
      `UPDATE review
       SET deleted_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE review_id = $1
         AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );

    return result.rows[0] || null;
  }

  async findApproved(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;
    const values = [];
    const clauses = ['r.deleted_at IS NULL', "r.status = 'approved'"];

    if (query.location_id) {
      values.push(query.location_id);
      clauses.push(`r.location_id = $${values.length}`);
    }
    if (query.tour_id) {
      values.push(query.tour_id);
      clauses.push(`r.tour_id = $${values.length}`);
    }
    if (query.rating) {
      values.push(query.rating);
      clauses.push(`r.rating = $${values.length}`);
    }
    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`r.comment ILIKE $${values.length}`);
    }

    values.push(limit, offset);
    const result = await db.query(
      `SELECT
          r.*,
          u.name AS user_name,
          u.avatar_url AS user_avatar_url
       FROM review r
       LEFT JOIN users u ON u.user_id = r.user_id
       WHERE ${clauses.join(' AND ')}
       ORDER BY r.review_id DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );
    return result.rows;
  }

  async findApprovedById(id) {
    const result = await db.query(
      `SELECT r.*,
              u.name AS user_name,
              u.avatar_url AS user_avatar_url
       FROM review r
       LEFT JOIN users u ON u.user_id = r.user_id
       WHERE r.review_id = $1
         AND r.deleted_at IS NULL
         AND r.status = 'approved'`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findActiveOwner(id) {
    const result = await db.query(
      `SELECT review_id, user_id
       FROM review
       WHERE review_id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] || null;
  }
}

module.exports = new ReviewModel();
