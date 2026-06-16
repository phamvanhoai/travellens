const db = require('../config/db');
const BaseService = require('./base.service');
const view360Model = require('../models/view360.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUploadedFile, removeUploadedFiles } = require('../utils/uploadedFile');

class View360Service extends BaseService {
  async listByLocation(locationId) {
    await this.ensureLocationExists(locationId);

    const result = await db.query(
      `SELECT *
       FROM view360
       WHERE location_id = $1 AND deleted_at IS NULL
       ORDER BY order_index ASC NULLS LAST, view_id ASC`,
      [locationId]
    );

    return result.rows;
  }

  async createForLocation(locationId, payload) {
    await this.ensureLocationExists(locationId);

    const result = await db.query(
      `INSERT INTO view360
         (location_id, title, description, audio_file, language, order_index)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        locationId,
        payload.title,
        payload.description,
        payload.audio_file,
        payload.language || 'vi',
        payload.order_index,
      ]
    );

    return result.rows[0];
  }

  async update(viewId, payload) {
    const currentView = await this.get(viewId);

    const fields = ['title', 'description', 'audio_file', 'language', 'order_index']
      .filter((field) => payload[field] !== undefined);

    if (!fields.length) {
      return this.get(viewId);
    }

    const values = fields.map((field) => payload[field]);
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    values.push(viewId);

    const result = await db.query(
      `UPDATE view360
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE view_id = $${values.length} AND deleted_at IS NULL
       RETURNING *`,
      values
    );

    const view = result.rows[0];

    if (
      payload.audio_file
      && currentView.audio_file
      && currentView.audio_file !== view.audio_file
    ) {
      await removeUploadedFile(currentView.audio_file);
    }

    return view;
  }

  async remove(viewId) {
    const currentView = await this.get(viewId);

    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const imageResult = await client.query(
        `SELECT image_file
         FROM view360_image
         WHERE view_id = $1 AND deleted_at IS NULL`,
        [viewId]
      );
      await client.query(
        `UPDATE view360_image
         SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
         WHERE view_id = $1 AND deleted_at IS NULL`,
        [viewId]
      );
      const result = await client.query(
        `UPDATE view360
         SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
         WHERE view_id = $1 AND deleted_at IS NULL
         RETURNING *`,
        [viewId]
      );
      await client.query('COMMIT');

      await removeUploadedFile(currentView.audio_file);
      await removeUploadedFiles(imageResult.rows.map((image) => image.image_file));

      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async get(id) {
    const result = await db.query(
      'SELECT * FROM view360 WHERE view_id = $1 AND deleted_at IS NULL',
      [id]
    );
    const view = result.rows[0];
    if (!view) {
      throw new ApiError(httpStatus.NOT_FOUND, 'View360 not found');
    }
    return view;
  }

  async ensureLocationExists(locationId) {
    const result = await db.query('SELECT location_id FROM location WHERE location_id = $1', [locationId]);
    if (!result.rows[0]) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }
  }

  async ensureViewExists(viewId) {
    await this.get(viewId);
  }
}

module.exports = new View360Service(view360Model);

