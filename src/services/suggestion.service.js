const db = require('../config/db');

class SuggestionService {
  async suggest({ destination_id: destinationId, tour_category_id: tourCategoryId, budget }) {
    const values = [];
    const clauses = [];

    if (destinationId) {
      values.push(destinationId);
      clauses.push(`EXISTS (
        SELECT 1
        FROM tour_destination td
        WHERE td.tour_id = tour.tour_id
          AND td.destination_id = $${values.length}
      )`);
    }
    if (tourCategoryId) {
      values.push(tourCategoryId);
      clauses.push(`tour_category_id = $${values.length}`);
    }
    if (budget) {
      values.push(budget);
      clauses.push(`price <= $${values.length}`);
    }

    clauses.push('deleted_at IS NULL');
    clauses.push("status = 'active'");
    const where = `WHERE ${clauses.join(' AND ')}`;
    const result = await db.query(`SELECT * FROM tour ${where} ORDER BY price ASC LIMIT 10`, values);
    return {
      source: 'rule-based',
      tours: result.rows,
    };
  }
}

module.exports = new SuggestionService();
