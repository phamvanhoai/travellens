const BaseService = require('./base.service');
const mapModel = require('../models/map.model');
const db = require('../config/db');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUploadedFile } = require('../utils/uploadedFile');

class MapService extends BaseService {
  list(query = {}) {
    return mapModel.findAllWithPagination(query);
  }

  async travel(query = {}) {
    const values = [];
    const destinationClauses = [
      'td.deleted_at IS NULL',
      'td.latitude IS NOT NULL',
      'td.longitude IS NOT NULL',
    ];
    const locationClauses = [
      'l.deleted_at IS NULL',
      'l.is_deleted = FALSE',
      'l.latitude IS NOT NULL',
      'l.longitude IS NOT NULL',
      'td.deleted_at IS NULL',
    ];

    const hasRadiusFilter = query.lat !== undefined && query.lng !== undefined && query.radius !== undefined;
    if (hasRadiusFilter) {
      values.push(Number(query.lat), Number(query.lng), Number(query.radius));
      const latRef = `$${values.length - 2}`;
      const lngRef = `$${values.length - 1}`;
      const radiusRef = `$${values.length}`;
      destinationClauses.push(`(
        6371 * acos(
          LEAST(1, GREATEST(-1,
            cos(radians(${latRef})) * cos(radians(td.latitude)) *
            cos(radians(td.longitude) - radians(${lngRef})) +
            sin(radians(${latRef})) * sin(radians(td.latitude))
          ))
        )
      ) <= ${radiusRef}`);
      locationClauses.push(`(
        6371 * acos(
          LEAST(1, GREATEST(-1,
            cos(radians(${latRef})) * cos(radians(l.latitude)) *
            cos(radians(l.longitude) - radians(${lngRef})) +
            sin(radians(${latRef})) * sin(radians(l.latitude))
          ))
        )
      ) <= ${radiusRef}`);
    }

    if (query.keyword) {
      values.push(`%${query.keyword}%`);
      const keywordRef = `$${values.length}`;
      destinationClauses.push(`(td.name ILIKE ${keywordRef} OR td.description ILIKE ${keywordRef})`);
      locationClauses.push(`(l.name ILIKE ${keywordRef} OR l.description ILIKE ${keywordRef} OR td.name ILIKE ${keywordRef})`);
    }

    if (query.category) {
      values.push(query.category);
      const categoryRef = `$${values.length}`;
      const categoryClause = `(dc.name ILIKE ${categoryRef} OR td.destination_category_id::text = ${categoryRef})`;
      destinationClauses.push(categoryClause);
      locationClauses.push(categoryClause);
    }

    const [destinationsResult, locationsResult] = await Promise.all([
      db.query(
        `SELECT
            td.destination_id,
            'destination' AS marker_type,
            td.name,
            td.description,
            CASE
              WHEN td.description IS NULL THEN NULL
              ELSE LEFT(td.description, 160)
            END AS short_description,
            td.thumbnail,
            td.latitude,
            td.longitude,
            dc.name AS category,
            COALESCE(rating_stats.rating, 0)::float AS rating,
            view360.view_id,
            CASE WHEN view360.view_id IS NULL THEN NULL ELSE CONCAT('/view360/', view360.view_id) END AS view360_url,
            CONCAT('/travel-destinations/', td.destination_id) AS detail_url
         FROM travel_destination td
         LEFT JOIN destination_category dc ON dc.destination_category_id = td.destination_category_id
         LEFT JOIN LATERAL (
            SELECT AVG(r.rating)::numeric(3,2) AS rating
            FROM location l
            INNER JOIN review r ON r.location_id = l.location_id
            WHERE l.destination_id = td.destination_id
              AND l.deleted_at IS NULL
              AND l.is_deleted = FALSE
              AND r.deleted_at IS NULL
              AND r.status = 'approved'
         ) rating_stats ON TRUE
         LEFT JOIN LATERAL (
            SELECT v.view_id
            FROM location l
            INNER JOIN view360 v ON v.location_id = l.location_id
            WHERE l.destination_id = td.destination_id
              AND l.deleted_at IS NULL
              AND l.is_deleted = FALSE
              AND v.deleted_at IS NULL
            ORDER BY v.order_index ASC NULLS LAST, v.view_id ASC
            LIMIT 1
         ) view360 ON TRUE
         WHERE ${destinationClauses.join(' AND ')}
         ORDER BY td.name ASC`,
        values
      ),
      db.query(
        `SELECT
            l.location_id,
            'location' AS marker_type,
            l.name,
            l.description,
            CASE
              WHEN l.description IS NULL THEN NULL
              ELSE LEFT(l.description, 160)
            END AS short_description,
            l.thumbnail,
            l.latitude,
            l.longitude,
            td.destination_id,
            td.name AS destination_name,
            dc.name AS category,
            COALESCE(rating_stats.rating, 0)::float AS rating,
            view360.view_id,
            CASE WHEN view360.view_id IS NULL THEN NULL ELSE CONCAT('/view360/', view360.view_id) END AS view360_url,
            CONCAT('/locations/', l.location_id) AS detail_url
         FROM location l
         INNER JOIN travel_destination td ON td.destination_id = l.destination_id
         LEFT JOIN destination_category dc ON dc.destination_category_id = td.destination_category_id
         LEFT JOIN LATERAL (
            SELECT AVG(r.rating)::numeric(3,2) AS rating
            FROM review r
            WHERE r.location_id = l.location_id
              AND r.deleted_at IS NULL
              AND r.status = 'approved'
         ) rating_stats ON TRUE
         LEFT JOIN LATERAL (
            SELECT v.view_id
            FROM view360 v
            WHERE v.location_id = l.location_id
              AND v.deleted_at IS NULL
            ORDER BY v.order_index ASC NULLS LAST, v.view_id ASC
            LIMIT 1
         ) view360 ON TRUE
         WHERE ${locationClauses.join(' AND ')}
         ORDER BY td.name ASC, l.name ASC`,
        values
      ),
    ]);

    return {
      destinations: destinationsResult.rows,
      locations: locationsResult.rows,
    };
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
    const currentMap = payload.map_file
      ? await this.get(id)
      : null;

    const map = await this.model.updateMap(id, payload);

    if (!map) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Map not found');
    }

    if (
      payload.map_file
      && currentMap?.map_file
      && currentMap.map_file !== map.map_file
    ) {
      await removeUploadedFile(currentMap.map_file);
    }

    return map;
  }

  async remove(id) {
    const map = await this.model.softDeleteMap(id);

    if (!map) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Map not found');
    }

    await removeUploadedFile(map.map_file);

    return map;
  }
}

module.exports = new MapService(mapModel);

