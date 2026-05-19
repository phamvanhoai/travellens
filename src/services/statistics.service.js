const db = require('../config/db');
const BaseService = require('./base.service');
const statisticsModel = require('../models/statistics.model');

class StatisticsService extends BaseService {
  async dashboard() {
    const [bookingSummary, revenue, cancellation, reviewSummary] = await Promise.all([
      db.query('SELECT status, COUNT(*)::int AS total FROM booking GROUP BY status'),
      db.query("SELECT COALESCE(SUM(amount), 0)::numeric AS total_revenue FROM payment WHERE status = 'paid'"),
      db.query("SELECT COUNT(*)::int AS total_canceled FROM booking WHERE status = 'canceled'"),
      db.query('SELECT COUNT(*)::int AS total_reviews, COALESCE(AVG(rating), 0)::numeric(3,2) AS average_rating FROM review'),
    ]);

    return {
      bookings: bookingSummary.rows,
      revenue: revenue.rows[0],
      cancellations: cancellation.rows[0],
      reviews: reviewSummary.rows[0],
    };
  }
}

module.exports = new StatisticsService(statisticsModel);

