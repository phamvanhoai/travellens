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
    const clauses = ['l.deleted_at IS NULL', 'l.is_deleted = FALSE'];

    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`(l.name ILIKE $${values.length} OR l.description ILIKE $${values.length})`);
    }

    if (query.destination_id) {
      values.push(query.destination_id);
      clauses.push(`l.destination_id = $${values.length}`);
    }

    const where = `WHERE ${clauses.join(' AND ')}`;
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
    const client = await db.getClient();

    try {
      await client.query('BEGIN');
      await this.ensureTravelDestinationExists(destinationId, client);
      await this.ensureUniqueName(destinationId, payload.name, null, client);

      const result = await client.query(
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
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Duplicate location name inside same destination');
      }
      if (error.code === '23503') {
        throw new ApiError(httpStatus.NOT_FOUND, 'Travel destination not found');
      }
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id, payload) {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');
      const current = await this.getActiveLocation(id, client);
      const destinationId = current.destination_id;

      if (payload.name) {
        await this.ensureUniqueName(destinationId, payload.name, id, client);
      }

      const fields = ['name', 'description', 'latitude', 'longitude', 'thumbnail']
        .filter((field) => payload[field] !== undefined);

      if (!fields.length) {
        await client.query('COMMIT');
        return current;
      }

      const values = fields.map((field) => (field === 'name' ? payload[field].trim() : payload[field]));
      const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
      values.push(id);

      const result = await client.query(
        `UPDATE location
         SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE location_id = $${values.length}
           AND deleted_at IS NULL
           AND is_deleted = FALSE
         RETURNING *`,
        values
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Duplicate location name inside same destination');
      }
      throw error;
    } finally {
      client.release();
    }
  }

  async remove(id) {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');
      await this.getActiveLocation(id, client);

      const relationResult = await client.query(
        `SELECT
            (
              SELECT COUNT(*)::int
              FROM view360
              WHERE location_id = $1 AND deleted_at IS NULL
            ) AS total_view360,
            (
              SELECT COUNT(*)::int
              FROM view360_image vi
              INNER JOIN view360 v ON v.view_id = vi.view_id
              WHERE v.location_id = $1
                AND v.deleted_at IS NULL
                AND vi.deleted_at IS NULL
            ) AS total_view360_images,
            (
              SELECT COUNT(*)::int
              FROM map
              WHERE location_id = $1
            ) AS total_maps,
            (
              SELECT COUNT(*)::int
              FROM review
              WHERE location_id = $1
            ) AS total_reviews,
            (
              SELECT COUNT(*)::int
              FROM blog_location
              WHERE location_id = $1
            ) AS total_blog_locations`,
        [id]
      );
      const relations = relationResult.rows[0];
      const hasRelatedData = Object.values(relations).some((total) => Number(total) > 0);

      if (hasRelatedData) {
        throw new ApiError(httpStatus.CONFLICT, 'Location has related data', relations);
      }

      const result = await client.query(
        `UPDATE location
         SET deleted_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP,
             is_deleted = TRUE
         WHERE location_id = $1 AND deleted_at IS NULL AND is_deleted = FALSE
         RETURNING *`,
        [id]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async get(id) {
    return this.getActiveLocation(id);
  }

  async getActiveLocation(id, executor = db) {
    const result = await executor.query(
      'SELECT * FROM location WHERE location_id = $1 AND deleted_at IS NULL AND is_deleted = FALSE',
      [id]
    );

    if (!result.rows[0]) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }

    return result.rows[0];
  }

  async ensureTravelDestinationExists(destinationId, executor = db) {
    const result = await executor.query(
      'SELECT destination_id FROM travel_destination WHERE destination_id = $1 AND deleted_at IS NULL',
      [destinationId]
    );

    if (!result.rows[0]) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Travel destination not found');
    }
  }

  async ensureUniqueName(destinationId, name, exceptLocationId, executor = db) {
    const values = [destinationId, name];
    let exceptClause = '';
    if (exceptLocationId) {
      values.push(exceptLocationId);
      exceptClause = `AND location_id <> $${values.length}`;
    }

    const result = await executor.query(
      `SELECT location_id
       FROM location
       WHERE destination_id = $1
         AND LOWER(name) = LOWER($2)
         AND deleted_at IS NULL
         AND is_deleted = FALSE
         ${exceptClause}`,
      values
    );

    if (result.rows[0]) {
      throw new ApiError(httpStatus.CONFLICT, 'Duplicate location name inside same destination');
    }
  }
}

module.exports = new LocationService(locationModel);
