const db = require('../config/db');

class SuggestionService {
  /**
   * AI-enhanced suggestion endpoint.
   * Accepts user preferences and queries DB for matching tours + destinations.
   */
  async suggest({ destination_id: destinationId, tour_category_id: tourCategoryId, budget, keywords, travel_style: travelStyle }) {
    const tours = await this._findTours({ destinationId, tourCategoryId, budget, keywords, travelStyle });
    const destinations = await this._findDestinations({ keywords, travelStyle });

    return {
      source: 'database',
      tours,
      destinations,
    };
  }

  async _findTours({ destinationId, tourCategoryId, budget, keywords, travelStyle }) {
    const values = [];
    const clauses = ["t.deleted_at IS NULL", "t.status = 'active'"];

    if (destinationId) {
      values.push(destinationId);
      clauses.push(`EXISTS (
        SELECT 1
        FROM tour_destination td
        WHERE td.tour_id = t.tour_id
          AND td.destination_id = $${values.length}
      )`);
    }

    if (tourCategoryId) {
      values.push(tourCategoryId);
      clauses.push(`t.tour_category_id = $${values.length}`);
    }

    if (budget) {
      values.push(budget);
      clauses.push(`t.price <= $${values.length}`);
    }

    // Keyword search
    if (keywords && keywords.length > 0) {
      const keywordPatterns = keywords.map((kw) => {
        values.push(`%${kw}%`);
        return `(t.name ILIKE $${values.length} OR t.description ILIKE $${values.length})`;
      });
      clauses.push(`(${keywordPatterns.join(' OR ')})`);
    }

    // Travel style filter (match against category name or description)
    if (travelStyle) {
      values.push(`%${travelStyle}%`);
      clauses.push(`(tc.name ILIKE $${values.length} OR t.description ILIKE $${values.length})`);
    }

    const where = `WHERE ${clauses.join(' AND ')}`;

    const result = await db.query(
      `SELECT
          t.tour_id,
          t.name,
          t.description,
          t.price::float AS price,
          t.child_price::float AS child_price,
          t.schedule,
          t.capacity,
          t.thumbnail,
          tc.name AS tour_category,
          COALESCE(dest_agg.destinations, '[]'::json) AS destinations
       FROM tour t
       LEFT JOIN tour_category tc ON tc.tour_category_id = t.tour_category_id
       LEFT JOIN LATERAL (
          SELECT json_agg(
            json_build_object(
              'destination_id', td.destination_id,
              'name', d.name
            )
            ORDER BY td.order_index ASC
          ) AS destinations
          FROM tour_destination td
          INNER JOIN travel_destination d ON d.destination_id = td.destination_id
          WHERE td.tour_id = t.tour_id
            AND d.deleted_at IS NULL
       ) dest_agg ON TRUE
       ${where}
       ORDER BY t.price ASC
       LIMIT 10`,
      values
    );

    return result.rows;
  }

  async _findDestinations({ keywords, travelStyle }) {
    const values = [];
    const clauses = ['td.deleted_at IS NULL'];

    if (keywords && keywords.length > 0) {
      const keywordPatterns = keywords.map((kw) => {
        values.push(`%${kw}%`);
        return `(td.name ILIKE $${values.length} OR td.description ILIKE $${values.length})`;
      });
      clauses.push(`(${keywordPatterns.join(' OR ')})`);
    }

    if (travelStyle) {
      values.push(`%${travelStyle}%`);
      clauses.push(`(dc.name ILIKE $${values.length} OR td.description ILIKE $${values.length})`);
    }

    // Only return destinations if we have some filter
    if (values.length === 0) return [];

    const where = `WHERE ${clauses.join(' AND ')}`;

    const result = await db.query(
      `SELECT
          td.destination_id,
          td.name,
          td.description,
          td.thumbnail,
          td.latitude,
          td.longitude,
          dc.name AS destination_category
       FROM travel_destination td
       LEFT JOIN destination_category dc ON dc.destination_category_id = td.destination_category_id
       ${where}
       ORDER BY td.created_at DESC
       LIMIT 10`,
      values
    );

    return result.rows;
  }
}

module.exports = new SuggestionService();
