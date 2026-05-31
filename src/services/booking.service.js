const db = require('../config/db');
const BaseService = require('./base.service');
const bookingModel = require('../models/booking.model');
const couponService = require('./coupon.service');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class BookingService extends BaseService {
  // LIST BOOKING
  async list(query = {}) {

    let sql = `
      SELECT *
      FROM booking
      WHERE 1=1
    `;

    const values = [];

    let index = 1;

    // FILTER USER
    if (query.user_id) {

      sql += ` AND user_id = $${index}`;

      values.push(query.user_id);

      index++;
    }

    // FILTER TOUR
    if (query.tour_id) {

      sql += ` AND tour_id = $${index}`;

      values.push(query.tour_id);

      index++;
    }

    // FILTER STATUS
    if (query.status) {

      sql += ` AND status = $${index}`;

      values.push(query.status);

      index++;
    }

    // SORT
    switch (query.sort) {

      case 'newest':
        sql += ` ORDER BY booking_id DESC`;
        break;

      case 'oldest':
        sql += ` ORDER BY booking_id ASC`;
        break;

      default:
        sql += ` ORDER BY booking_id DESC`;
    }

    // PAGINATION
    const page = parseInt(query.page) || 1;

    const limit = parseInt(query.limit) || 10;

    const offset = (page - 1) * limit;

    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    const result = await db.query(sql, values);

    return result.rows;
  }

  async create(payload) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const passengers = payload.passengers || payload.details || [];
      const originalAmount = passengers.reduce((sum, passenger) => sum + Number(passenger.price || 0), 0);
      let couponSnapshot = {
        coupon_id: payload.coupon_id || null,
        discount_amount: Number(payload.discount_amount || 0),
        final_amount: payload.final_amount !== undefined ? Number(payload.final_amount) : originalAmount,
      };

      if (payload.coupon_code) {
        couponSnapshot = await couponService.validateCoupon({
          code: payload.coupon_code,
          booking_amount: originalAmount,
        });
      }

      const bookingResult = await client.query(
        `INSERT INTO booking
           (user_id, tour_id, coupon_id, original_amount, discount_amount, final_amount, status, payment_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          payload.user_id,
          payload.tour_id,
          couponSnapshot.coupon_id,
          originalAmount,
          couponSnapshot.discount_amount,
          couponSnapshot.final_amount,
          payload.status || 'pending',
          payload.payment_status || 'pending',
        ]
      );
      const booking = bookingResult.rows[0];

      const details = [];
      for (const passenger of passengers) {
        const detailResult = await client.query(
          `INSERT INTO booking_detail
           (booking_id, passenger_name, age_category, price, seat_number, special_request)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [
            booking.booking_id,
            passenger.passenger_name,
            passenger.age_category,
            passenger.price,
            passenger.seat_number,
            passenger.special_request,
          ]
        );
        details.push(detailResult.rows[0]);
      }

      if (couponSnapshot.coupon_id) {
        await couponService.markUsed(couponSnapshot.coupon_id, client);
      }

      await client.query('COMMIT');
      return { ...booking, details };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async cancel(id) {
    const booking = await this.model.update(id, { status: 'canceled' });
    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }
    return booking;
  }
}

module.exports = new BookingService(bookingModel);

