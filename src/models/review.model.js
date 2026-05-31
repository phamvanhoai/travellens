const db = require('../config/db');
const BaseModel = require('./base.model');

class ReviewModel extends BaseModel {
  constructor() {
    super({
      table: 'review',
      primaryKey: 'review_id',
      fields: ['user_id', 'location_id', 'rating', 'comment', 'images', 'status'],
      searchable: ['comment'],
      filters: ['user_id', 'location_id', 'rating', 'status'],
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
}

module.exports = new ReviewModel();
