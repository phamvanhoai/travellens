const db = require('../config/db');

class SuggestionService {
  async suggest({ destination_id: destinationId, tour_category_id: tourCategoryId, budget }) {
    const values = [];
    const clauses = [];

    if (destinationId) {
      values.push(destinationId);
      clauses.push(`destination_id = $${values.length}`);
    }
    if (tourCategoryId) {
      values.push(tourCategoryId);
      clauses.push(`tour_category_id = $${values.length}`);
    }
    if (budget) {
      values.push(budget);
      clauses.push(`price <= $${values.length}`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await db.query(`SELECT * FROM tour ${where} ORDER BY price ASC LIMIT 10`, values);
    return {
      source: 'rule-based',
      tours: result.rows,
    };
  }
}

module.exports = new SuggestionService();
