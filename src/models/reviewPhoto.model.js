const db = require('../config/db');
const BaseModel = require('./base.model');

class ReviewPhotoModel extends BaseModel {
  constructor() {
    super({
      table: 'review_photo',
      primaryKey: 'photo_id',
      fields: ['review_id', 'photo_url', 'original_name', 'mime_type', 'file_size'],
      filters: ['review_id'],
    });
  }

  async createMany(reviewId, photos) {
    if (!photos.length) {
      return [];
    }

    const values = [];
    const rows = photos.map((photo, index) => {
      const base = index * 5;
      values.push(reviewId, photo.photo_url, photo.original_name, photo.mime_type, photo.file_size);
      return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`;
    });

    const result = await db.query(
      `INSERT INTO review_photo (review_id, photo_url, original_name, mime_type, file_size)
       VALUES ${rows.join(', ')}
       RETURNING photo_id, review_id, photo_url, original_name, mime_type, file_size, created_at`,
      values
    );

    return result.rows;
  }

  async countActiveByReview(reviewId) {
    const result = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM review_photo
       WHERE review_id = $1
         AND deleted_at IS NULL`,
      [reviewId]
    );

    return result.rows[0].total;
  }

  async softDeleteByReview(reviewId) {
    const result = await db.query(
      `UPDATE review_photo
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE review_id = $1
         AND deleted_at IS NULL
       RETURNING *`,
      [reviewId]
    );

    return result.rows;
  }
}

module.exports = new ReviewPhotoModel();
