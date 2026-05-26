const BaseService = require('./base.service');
const mapModel = require('../models/map.model');
const db = require('../config/db');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class MapService extends BaseService {
  list(query = {}) {
    return mapModel.findAllWithPagination(query);
  }

  async get(id) {
    const map = await this.model.findActiveById(id);

    if (!map) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Map not found');
    }

    return map;
  }

  async create(payload) {
    const location = await db.query(
      `SELECT location_id
       FROM location
       WHERE location_id = $1
         AND deleted_at IS NULL
         AND is_deleted = FALSE`,
      [payload.location_id]
    );

    if (!location.rows[0]) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }

    return this.model.create(payload);
  }

  async update(id, payload) {
    const map = await this.model.updateMap(id, payload);

    if (!map) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Map not found');
    }

    return map;
  }

  async remove(id) {
    const map = await this.model.softDeleteMap(id);

    if (!map) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Map not found');
    }

    return map;
  }
}

module.exports = new MapService(mapModel);

