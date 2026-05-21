const db = require('../config/db');
const BaseService = require('./base.service');
const tourModel = require('../models/tour.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class TourService extends BaseService {
  async create(payload) {
    await this.ensureTravelDestinationExists(payload.destination_id);
    await this.ensureTourCategoryExists(payload.tour_category_id);

    return this.model.create(payload);
  }

  async update(id, payload) {
    if (payload.destination_id !== undefined) {
      await this.ensureTravelDestinationExists(payload.destination_id);
    }
    if (payload.tour_category_id !== undefined) {
      await this.ensureTourCategoryExists(payload.tour_category_id);
    }

    return super.update(id, payload);
  }

  async ensureTravelDestinationExists(destinationId) {
    const result = await db.query(
      'SELECT destination_id FROM travel_destination WHERE destination_id = $1 AND deleted_at IS NULL',
      [destinationId]
    );
    if (!result.rows[0]) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Travel destination does not exist');
    }
  }

  async ensureTourCategoryExists(tourCategoryId) {
    if (tourCategoryId === undefined || tourCategoryId === null || tourCategoryId === '') {
      return;
    }

    const result = await db.query(
      'SELECT tour_category_id FROM tour_category WHERE tour_category_id = $1',
      [tourCategoryId]
    );
    if (!result.rows[0]) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tour category does not exist');
    }
  }
}

module.exports = new TourService(tourModel);

