const db = require('../config/db');
const BaseService = require('./base.service');
const bookingModel = require('../models/booking.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class BookingService extends BaseService {
  async create(payload) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const bookingResult = await client.query(
        `INSERT INTO booking (user_id, tour_id, status, payment_status)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [payload.user_id, payload.tour_id, payload.status || 'pending', payload.payment_status || 'pending']
      );
      const booking = bookingResult.rows[0];

      const passengers = payload.passengers || payload.details || [];
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

