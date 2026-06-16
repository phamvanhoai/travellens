const db = require('../config/db');
const BaseService = require('./base.service');
const view360ImageModel = require('../models/view360Image.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUploadedFile } = require('../utils/uploadedFile');

class View360ImageService extends BaseService {
  async listByView(viewId) {
    await this.ensureViewExists(viewId);

    const result = await db.query(
      `SELECT *
       FROM view360_image
       WHERE view_id = $1 AND deleted_at IS NULL
       ORDER BY order_index ASC NULLS LAST, image_id ASC`,
      [viewId]
    );

    return result.rows;
  }

  async createForView(viewId, payload) {
    await this.ensureViewExists(viewId);

    const result = await db.query(
      `INSERT INTO view360_image (view_id, image_file, order_index)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [viewId, payload.image_file, payload.order_index]
    );

    return result.rows[0];
  }

  async update(imageId, payload) {
    const currentImage = await this.get(imageId);

    const fields = ['image_file', 'order_index']
      .filter((field) => payload[field] !== undefined);

    if (!fields.length) {
      return this.get(imageId);
    }

    const values = fields.map((field) => payload[field]);
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    values.push(imageId);

    const result = await db.query(
      `UPDATE view360_image
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE image_id = $${values.length} AND deleted_at IS NULL
       RETURNING *`,
      values
    );

    const image = result.rows[0];

    if (
      payload.image_file
      && currentImage.image_file
      && currentImage.image_file !== image.image_file
    ) {
      await removeUploadedFile(currentImage.image_file);
    }

    return image;
  }

  async remove(imageId) {
    const currentImage = await this.get(imageId);

    const result = await db.query(
      `UPDATE view360_image
       SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE image_id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [imageId]
    );

    await removeUploadedFile(currentImage.image_file);

    return result.rows[0];
  }

  async get(imageId) {
    const result = await db.query(
      'SELECT * FROM view360_image WHERE image_id = $1 AND deleted_at IS NULL',
      [imageId]
    );
    const image = result.rows[0];
    if (!image) {
      throw new ApiError(httpStatus.NOT_FOUND, 'View360 image not found');
    }
    return image;
  }

  async ensureViewExists(viewId) {
    const result = await db.query(
      'SELECT view_id FROM view360 WHERE view_id = $1 AND deleted_at IS NULL',
      [viewId]
    );
    if (!result.rows[0]) {
      throw new ApiError(httpStatus.NOT_FOUND, 'View360 not found');
    }
  }

  async ensureImageExists(imageId) {
    await this.get(imageId);
  }
}

module.exports = new View360ImageService(view360ImageModel);

