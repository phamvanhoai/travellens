const db = require('../config/db');

const buildDistanceClause = ({ lat, lng, radius }, latitudeColumn, longitudeColumn, values) => {
  if (lat === undefined || lng === undefined || radius === undefined) {
    return null;
  }

  values.push(Number(lat), Number(lng), Number(radius));
  const latRef = `$${values.length - 2}`;
  const lngRef = `$${values.length - 1}`;
  const radiusRef = `$${values.length}`;

  return `(
    6371 * acos(
      LEAST(1, GREATEST(-1,
        cos(radians(${latRef})) * cos(radians(${latitudeColumn})) *
        cos(radians(${longitudeColumn}) - radians(${lngRef})) +
        sin(radians(${latRef})) * sin(radians(${latitudeColumn}))
      ))
    )
  ) <= ${radiusRef}`;
};

class MapFilterService {
  async filter(query = {}) {
    const filter = { ...query };
    if (filter.nearby_only && filter.lat !== undefined && filter.lng !== undefined && filter.radius === undefined) {
      filter.radius = 5;
    }

    const destinationValues = [];
    const locationValues = [];
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

    if (filter.destination_category_id) {
      destinationValues.push(filter.destination_category_id);
      locationValues.push(filter.destination_category_id);
      destinationClauses.push(`td.destination_category_id = $${destinationValues.length}`);
      locationClauses.push(`td.destination_category_id = $${locationValues.length}`);
    }

    const destinationDistanceClause = buildDistanceClause(filter, 'td.latitude', 'td.longitude', destinationValues);
    const locationDistanceClause = buildDistanceClause(filter, 'l.latitude', 'l.longitude', locationValues);
    if (destinationDistanceClause && locationDistanceClause) {
      destinationClauses.push(destinationDistanceClause);
      locationClauses.push(locationDistanceClause);
    }

    if (filter.has_view360 !== undefined) {
      const view360Clause = filter.has_view360
        ? 'view360.view_id IS NOT NULL'
        : 'view360.view_id IS NULL';
      destinationClauses.push(view360Clause);
      locationClauses.push(view360Clause);
    }

    if (filter.min_rating !== undefined) {
      destinationValues.push(Number(filter.min_rating));
      locationValues.push(Number(filter.min_rating));
      destinationClauses.push(`COALESCE(rating_stats.rating, 0) >= $${destinationValues.length}`);
      locationClauses.push(`COALESCE(rating_stats.rating, 0) >= $${locationValues.length}`);
    }

    if (filter.popular_only) {
      destinationClauses.push('COALESCE(popularity.booking_count, 0) > 0');
      locationClauses.push('COALESCE(popularity.booking_count, 0) > 0');
    }

    const [destinationsResult, locationsResult] = await Promise.all([
      db.query(
        `SELECT
            td.destination_id AS id,
            td.destination_id,
            NULL::int AS location_id,
            'destination' AS marker_type,
            td.name,
            CASE
              WHEN td.description IS NULL THEN NULL
              ELSE LEFT(td.description, 160)
            END AS short_description,
            td.thumbnail,
            td.latitude,
            td.longitude,
            dc.destination_category_id,
            dc.name AS category,
            COALESCE(rating_stats.rating, 0)::float AS rating,
            COALESCE(popularity.booking_count, 0)::int AS booking_count,
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
         LEFT JOIN LATERAL (
            SELECT COUNT(DISTINCT b.booking_id)::int AS booking_count
            FROM tour_destination tour_dest
            INNER JOIN booking b ON b.tour_id = tour_dest.tour_id
            WHERE tour_dest.destination_id = td.destination_id
              AND b.status IN ('pending', 'confirmed', 'paid')
         ) popularity ON TRUE
         WHERE ${destinationClauses.join(' AND ')}`,
        destinationValues
      ),
      db.query(
        `SELECT
            l.location_id AS id,
            td.destination_id,
            l.location_id,
            'location' AS marker_type,
            l.name,
            CASE
              WHEN l.description IS NULL THEN NULL
              ELSE LEFT(l.description, 160)
            END AS short_description,
            COALESCE(l.thumbnail, td.thumbnail) AS thumbnail,
            l.latitude,
            l.longitude,
            dc.destination_category_id,
            dc.name AS category,
            COALESCE(rating_stats.rating, 0)::float AS rating,
            COALESCE(popularity.booking_count, 0)::int AS booking_count,
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
         ) rating_stats ON TRUE
         LEFT JOIN LATERAL (
            SELECT v.view_id
            FROM view360 v
            WHERE v.location_id = l.location_id
              AND v.deleted_at IS NULL
            ORDER BY v.order_index ASC NULLS LAST, v.view_id ASC
            LIMIT 1
         ) view360 ON TRUE
         LEFT JOIN LATERAL (
            SELECT COUNT(DISTINCT b.booking_id)::int AS booking_count
            FROM tour_destination tour_dest
            INNER JOIN booking b ON b.tour_id = tour_dest.tour_id
            WHERE tour_dest.destination_id = td.destination_id
              AND b.status IN ('pending', 'confirmed', 'paid')
         ) popularity ON TRUE
         WHERE ${locationClauses.join(' AND ')}`,
        locationValues
      ),
    ]);

    return [...destinationsResult.rows, ...locationsResult.rows]
      .sort((a, b) => b.booking_count - a.booking_count || b.rating - a.rating || a.name.localeCompare(b.name));
  }
}

module.exports = new MapFilterService();
