const db = require('../config/db');

class NearbyService {
  async suggest({ lat, lng, radius = 5 }) {
    const params = [Number(lat), Number(lng), Number(radius)];

    const result = await db.query(
      `WITH destination_markers AS (
          SELECT
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
            dc.name AS category,
            COALESCE(rating_stats.rating, 0)::float AS rating,
            COALESCE(popularity.booking_count, 0)::int AS popularity,
            view360.view_id,
            CASE WHEN view360.view_id IS NULL THEN FALSE ELSE TRUE END AS has_view360,
            CASE WHEN view360.view_id IS NULL THEN NULL ELSE CONCAT('/view360/', view360.view_id) END AS view360_url,
            CONCAT('/travel-destinations/', td.destination_id) AS detail_url,
            CASE WHEN popularity.tour_id IS NULL THEN NULL ELSE CONCAT('/navigation/routes/', popularity.tour_id) END AS route_url,
            (
              6371 * acos(
                LEAST(1, GREATEST(-1,
                  cos(radians($1)) * cos(radians(td.latitude)) *
                  cos(radians(td.longitude) - radians($2)) +
                  sin(radians($1)) * sin(radians(td.latitude))
                ))
              )
            ) AS distance_km
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
          LEFT JOIN LATERAL (
            SELECT
              COUNT(DISTINCT b.booking_id)::int AS booking_count,
              MIN(tour_dest.tour_id) AS tour_id
            FROM tour_destination tour_dest
            LEFT JOIN booking b ON b.tour_id = tour_dest.tour_id
              AND b.status IN ('pending', 'confirmed', 'paid')
            WHERE tour_dest.destination_id = td.destination_id
          ) popularity ON TRUE
          WHERE td.deleted_at IS NULL
            AND td.latitude IS NOT NULL
            AND td.longitude IS NOT NULL
        ),
        location_markers AS (
          SELECT
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
            dc.name AS category,
            COALESCE(rating_stats.rating, 0)::float AS rating,
            COALESCE(popularity.booking_count, 0)::int AS popularity,
            view360.view_id,
            CASE WHEN view360.view_id IS NULL THEN FALSE ELSE TRUE END AS has_view360,
            CASE WHEN view360.view_id IS NULL THEN NULL ELSE CONCAT('/view360/', view360.view_id) END AS view360_url,
            CONCAT('/locations/', l.location_id) AS detail_url,
            CASE WHEN popularity.tour_id IS NULL THEN NULL ELSE CONCAT('/navigation/routes/', popularity.tour_id) END AS route_url,
            (
              6371 * acos(
                LEAST(1, GREATEST(-1,
                  cos(radians($1)) * cos(radians(l.latitude)) *
                  cos(radians(l.longitude) - radians($2)) +
                  sin(radians($1)) * sin(radians(l.latitude))
                ))
              )
            ) AS distance_km
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
          LEFT JOIN LATERAL (
            SELECT
              COUNT(DISTINCT b.booking_id)::int AS booking_count,
              MIN(tour_dest.tour_id) AS tour_id
            FROM tour_destination tour_dest
            LEFT JOIN booking b ON b.tour_id = tour_dest.tour_id
              AND b.status IN ('pending', 'confirmed', 'paid')
            WHERE tour_dest.destination_id = td.destination_id
          ) popularity ON TRUE
          WHERE l.deleted_at IS NULL
            AND l.is_deleted = FALSE
            AND l.latitude IS NOT NULL
            AND l.longitude IS NOT NULL
            AND td.deleted_at IS NULL
        )
        SELECT
          id,
          destination_id,
          location_id,
          marker_type,
          name,
          short_description,
          thumbnail,
          latitude,
          longitude,
          category,
          rating,
          popularity,
          view_id,
          has_view360,
          view360_url,
          detail_url,
          route_url,
          ROUND(distance_km::numeric, 2)::float AS distance_km
        FROM (
          SELECT * FROM destination_markers
          UNION ALL
          SELECT * FROM location_markers
        ) nearby
        WHERE distance_km <= $3
        ORDER BY
          distance_km ASC,
          has_view360 DESC,
          popularity DESC,
          rating DESC,
          name ASC
        LIMIT 50`,
      params
    );

    return result.rows;
  }
}

module.exports = new NearbyService();
