const db = require('../config/db');
const BaseService = require('./base.service');
const travelDestinationModel = require('../models/travelDestination.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class TravelDestinationService extends BaseService {
  async list(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
    const offset = (page - 1) * limit;
    const values = [];
    const clauses = ['td.deleted_at IS NULL'];

    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`(td.name ILIKE $${values.length} OR td.description ILIKE $${values.length})`);
    }

    const categoryId = query.destination_category_id;
    if (categoryId) {
      values.push(categoryId);
      clauses.push(`td.destination_category_id = $${values.length}`);
    }

    const where = `WHERE ${clauses.join(' AND ')}`;
    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total FROM travel_destination td ${where}`,
      values
    );

    values.push(limit, offset);
    const result = await db.query(
      `SELECT
          td.destination_id,
          td.name,
          td.description,
          td.thumbnail,
          td.destination_category_id,
          dc.name AS destination_category,
          td.created_at,
          td.updated_at
       FROM travel_destination td
       LEFT JOIN destination_category dc ON dc.destination_category_id = td.destination_category_id
       ${where}
       ORDER BY td.created_at DESC, td.destination_id DESC
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

  async get(id) {
    const destinationResult = await db.query(
      `SELECT
          td.*,
          dc.name AS destination_category
       FROM travel_destination td
       LEFT JOIN destination_category dc ON dc.destination_category_id = td.destination_category_id
       WHERE td.destination_id = $1 AND td.deleted_at IS NULL`,
      [id]
    );
    const destination = destinationResult.rows[0];

    if (!destination) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Travel destination not found');
    }

    const [locations, tours, view360, statistics] = await Promise.all([
      db.query('SELECT * FROM location WHERE destination_id = $1 ORDER BY location_id DESC', [id]),
      db.query('SELECT * FROM tour WHERE destination_id = $1 ORDER BY tour_id DESC', [id]),
      db.query(
        `SELECT v.*
         FROM view360 v
         INNER JOIN location l ON l.location_id = v.location_id
         WHERE l.destination_id = $1
         ORDER BY v.view_id DESC`,
        [id]
      ),
      this.statistics(id),
    ]);

    return {
      ...destination,
      locations: locations.rows,
      tours: tours.rows,
      view360: view360.rows,
      statistics,
    };
  }

  async create(payload) {
    const exists = await db.query(
      'SELECT destination_id FROM travel_destination WHERE LOWER(name) = LOWER($1) AND deleted_at IS NULL',
      [payload.name]
    );
    if (exists.rows[0]) {
      throw new ApiError(httpStatus.CONFLICT, 'Travel destination name already exists');
    }

    await this.ensureDestinationCategoryExists(payload.destination_category_id);

    try {
      const result = await db.query(
        `INSERT INTO travel_destination (name, description, thumbnail, destination_category_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [payload.name, payload.description, payload.thumbnail, payload.destination_category_id]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Travel destination name already exists');
      }
      if (error.code === '23503') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Destination category does not exist');
      }
      throw error;
    }
  }

  async update(id, payload) {
    await this.ensureExists(id);

    if (payload.name) {
      const duplicated = await db.query(
        `SELECT destination_id
         FROM travel_destination
         WHERE LOWER(name) = LOWER($1)
           AND destination_id <> $2
           AND deleted_at IS NULL`,
        [payload.name, id]
      );
      if (duplicated.rows[0]) {
        throw new ApiError(httpStatus.CONFLICT, 'Travel destination name already exists');
      }
    }

    await this.ensureDestinationCategoryExists(payload.destination_category_id);

    const fields = ['name', 'description', 'thumbnail', 'destination_category_id']
      .filter((field) => payload[field] !== undefined);

    if (!fields.length) {
      return this.get(id);
    }

    const values = fields.map((field) => payload[field]);
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    values.push(id);

    const result = await db.query(
      `UPDATE travel_destination
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE destination_id = $${values.length} AND deleted_at IS NULL
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async remove(id) {
    await this.ensureExists(id);

    const relationResult = await db.query(
      `SELECT
          (SELECT COUNT(*)::int FROM tour WHERE destination_id = $1) AS total_tours,
          (SELECT COUNT(*)::int FROM location WHERE destination_id = $1) AS total_locations`,
      [id]
    );
    const relations = relationResult.rows[0];

    if (relations.total_tours > 0 || relations.total_locations > 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Cannot delete travel destination while tours or locations still exist',
        relations
      );
    }

    const result = await db.query(
      `UPDATE travel_destination
       SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE destination_id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );

    return result.rows[0];
  }

  async ensureExists(id) {
    const result = await db.query(
      'SELECT destination_id FROM travel_destination WHERE destination_id = $1 AND deleted_at IS NULL',
      [id]
    );
    if (!result.rows[0]) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Travel destination not found');
    }
  }

  async ensureDestinationCategoryExists(destinationCategoryId) {
    if (destinationCategoryId === undefined || destinationCategoryId === null || destinationCategoryId === '') {
      return;
    }

    const result = await db.query(
      'SELECT destination_category_id FROM destination_category WHERE destination_category_id = $1',
      [destinationCategoryId]
    );
    if (!result.rows[0]) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Destination category does not exist');
    }
  }

  async statistics(id) {
    const result = await db.query(
      `SELECT
          (SELECT COUNT(*)::int FROM location WHERE destination_id = $1) AS total_locations,
          (SELECT COUNT(*)::int FROM tour WHERE destination_id = $1) AS total_tours,
          (
            SELECT COUNT(*)::int
            FROM booking b
            INNER JOIN tour t ON t.tour_id = b.tour_id
            WHERE t.destination_id = $1
          ) AS total_bookings,
          (
            SELECT COUNT(*)::int
            FROM review r
            INNER JOIN location l ON l.location_id = r.location_id
            WHERE l.destination_id = $1
          ) AS total_reviews`,
      [id]
    );

    return result.rows[0];
  }
}

module.exports = new TravelDestinationService(travelDestinationModel);
