const db = require('../config/db');
const BaseService = require('./base.service');
const locationModel = require('../models/location.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const SORT_COLUMNS = {
  location_id: 'l.location_id',
  name: 'l.name',
  created_at: 'l.created_at',
  updated_at: 'l.updated_at',
};

class LocationService extends BaseService {
  async list(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
    const offset = (page - 1) * limit;
    const values = [];
    const clauses = [];

    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`(l.name ILIKE $${values.length} OR l.description ILIKE $${values.length})`);
    }

    if (query.destination_id) {
      values.push(query.destination_id);
      clauses.push(`l.destination_id = $${values.length}`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const sortBy = SORT_COLUMNS[query.sortBy] || SORT_COLUMNS.created_at;
    const sortOrder = String(query.sortOrder || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total FROM location l ${where}`,
      values
    );

    values.push(limit, offset);
    const result = await db.query(
      `SELECT
          l.location_id,
          l.name,
          l.latitude,
          l.longitude,
          l.description,
          l.thumbnail,
          l.destination_id AS travel_destination_id,
          td.name AS travel_destination_name,
          l.created_at,
          l.updated_at
       FROM location l
       LEFT JOIN travel_destination td ON td.destination_id = l.destination_id
       ${where}
       ORDER BY ${sortBy} ${sortOrder}, l.location_id DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    return {
      items: result.rows,
      pagination: {
        page,
        limit,
        total: countResult.rows[0].total,
      },
    };
  }

  async create(payload) {
    const destinationId = payload.travel_destination_id || payload.destination_id;
    await this.ensureTravelDestinationExists(destinationId);
    await this.ensureUniqueName(destinationId, payload.name);

    try {
      const result = await db.query(
        `INSERT INTO location
           (destination_id, name, description, latitude, longitude, thumbnail)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          destinationId,
          payload.name.trim(),
          payload.description,
          payload.latitude,
          payload.longitude,
          payload.thumbnail,
        ]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Duplicate location name inside same destination');
      }
      if (error.code === '23503') {
        throw new ApiError(httpStatus.NOT_FOUND, 'Travel destination not found');
      }
      throw error;
    }
  }

  async update(id, payload) {
    const current = await this.get(id);
    const destinationId = payload.travel_destination_id || payload.destination_id || current.destination_id;

    if (payload.travel_destination_id || payload.destination_id) {
      await this.ensureTravelDestinationExists(destinationId);
      payload.destination_id = destinationId;
      delete payload.travel_destination_id;
    }

    if (payload.name) {
      await this.ensureUniqueName(destinationId, payload.name, id);
    }

    return super.update(id, payload);
  }

  async ensureTravelDestinationExists(destinationId) {
    const result = await db.query(
      'SELECT destination_id FROM travel_destination WHERE destination_id = $1 AND deleted_at IS NULL',
      [destinationId]
    );

    if (!result.rows[0]) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Travel destination not found');
    }
  }

  async ensureUniqueName(destinationId, name, exceptLocationId) {
    const values = [destinationId, name];
    let exceptClause = '';
    if (exceptLocationId) {
      values.push(exceptLocationId);
      exceptClause = `AND location_id <> $${values.length}`;
    }

    const result = await db.query(
      `SELECT location_id
       FROM location
       WHERE destination_id = $1
         AND LOWER(name) = LOWER($2)
         ${exceptClause}`,
      values
    );

    if (result.rows[0]) {
      throw new ApiError(httpStatus.CONFLICT, 'Duplicate location name inside same destination');
    }
  }
}

module.exports = new LocationService(locationModel);
