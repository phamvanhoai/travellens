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

  async userStats() {
    const [total, byRole, byStatus] = await Promise.all([
      db.query('SELECT COUNT(*)::int AS total_users FROM users'),
      db.query('SELECT role, COUNT(*)::int AS total FROM users GROUP BY role ORDER BY role'),
      db.query('SELECT COALESCE(status, \'unknown\') AS status, COUNT(*)::int AS total FROM users GROUP BY status ORDER BY status'),
    ]);

    return {
      total: total.rows[0],
      by_role: byRole.rows,
      by_status: byStatus.rows,
    };
  }

  async locationStats() {
    const [locations, maps, view360, view360Images, reviews] = await Promise.all([
      db.query('SELECT COUNT(*)::int AS total_locations FROM location'),
      db.query('SELECT COUNT(*)::int AS total_maps FROM map'),
      db.query('SELECT COUNT(*)::int AS total_view360 FROM view360'),
      db.query('SELECT COUNT(*)::int AS total_view360_images FROM view360_image'),
      db.query(`
        SELECT r.location_id, l.name AS location_name, COUNT(*)::int AS total_reviews, COALESCE(AVG(r.rating), 0)::numeric(3,2) AS average_rating 
        FROM review r 
        JOIN location l ON r.location_id = l.location_id 
        WHERE r.location_id IS NOT NULL AND r.deleted_at IS NULL 
        GROUP BY r.location_id, l.name 
        ORDER BY total_reviews DESC 
        LIMIT 10
      `),
    ]);

    return {
      locations: locations.rows[0],
      maps: maps.rows[0],
      view360: view360.rows[0],
      view360_images: view360Images.rows[0],
      top_reviewed_locations: reviews.rows,
    };
  }

  async contentStats() {
    const [blogs, reviews, reviewPhotos] = await Promise.all([
      db.query('SELECT COUNT(*)::int AS total_blogs FROM blog'),
      db.query('SELECT COUNT(*)::int AS total_reviews, COALESCE(AVG(rating), 0)::numeric(3,2) AS average_rating FROM review'),
      db.query("SELECT COUNT(*)::int AS reviews_with_photos FROM review WHERE images IS NOT NULL AND images <> ''"),
    ]);

    return {
      blogs: blogs.rows[0],
      reviews: reviews.rows[0],
      review_photos: reviewPhotos.rows[0],
    };
  }
}

module.exports = new StatisticsService(statisticsModel);
