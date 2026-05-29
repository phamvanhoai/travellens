const db = require('../config/db');
const BaseService = require('./base.service');
const tourModel = require('../models/tour.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class TourService extends BaseService {
  async list(query = {}) {

    let sql = `SELECT * FROM tour WHERE 1=1`;

    const values = [];

    let index = 1;

    // SEARCH
    if (query.search) {

      sql += ` AND (name ILIKE $${index} OR description ILIKE $${index})`;

      values.push(`%${query.search}%`);

      index++;
    }

    // FILTER DESTINATION
    if (query.destination_id) {

      sql += ` AND destination_id = $${index}`;

      values.push(query.destination_id);

      index++;
    }

    // FILTER CATEGORY
    if (query.tour_category_id) {

      sql += ` AND tour_category_id = $${index}`;

      values.push(query.tour_category_id);

      index++;
    }

    // SORT
    switch (query.sort) {

      case 'newest':
        sql += ` ORDER BY tour_id DESC`;
        break;

      case 'price_asc':
        sql += ` ORDER BY price ASC`;
        break;

      case 'price_desc':
        sql += ` ORDER BY price DESC`;
        break;

      default:
        sql += ` ORDER BY tour_id DESC`;
    }

    // PAGINATION
    const page = parseInt(query.page) || 1;

    const limit = parseInt(query.limit) || 10;

    const offset = (page - 1) * limit;

    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    const result = await db.query(sql, values);

    return result.rows;
  }
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

