const db = require('../config/db');
const BaseService = require('./base.service');
const bookingModel = require('../models/booking.model');
const tourModel = require('../models/tour.model');
const couponService = require('./coupon.service');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed', 'paid'];

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
      if (!payload.user_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User is required for booking');
      }
      if (!passengers.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'At least one passenger is required');
      }

      const tour = await this.ensureBookableTourExists(payload.tour_id, client, { lock: true });
      await this.ensureCustomerExists(payload.user_id, client);
      await this.ensureTourHasCapacity(tour, passengers.length, client);

      const originalAmount = passengers.reduce((sum, passenger) => sum + Number(passenger.price || 0), 0);
      let couponSnapshot = {
        coupon_id: null,
        discount_amount: 0,
        final_amount: originalAmount,
      };

      if (payload.coupon_code) {
        couponSnapshot = await couponService.validateCoupon({
          code: payload.coupon_code,
          booking_amount: originalAmount,
        });
      } else if (payload.coupon_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Use coupon_code to apply coupon');
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
          'pending',
          'unpaid',
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

      await client.query('COMMIT');
      return { ...booking, details };
    } catch (error) {
      await client.query('ROLLBACK');
      if (error.code === '23503' && error.constraint === 'fk_booking_tour') {
        throw new ApiError(httpStatus.NOT_FOUND, 'Tour not found');
      }
      throw error;
    } finally {
      client.release();
    }
  }

  listForUser(userId, query = {}) {
    return this.list({ ...query, user_id: userId });
  }

  async ensureBookableTourExists(tourId, client = db, options = {}) {
    const tour = options.lock
      ? await this.findBookableTourForUpdate(tourId, client)
      : await tourModel.findRawById(tourId, client);
    if (!tour) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Tour not found');
    }
    if (tour.status !== 'active') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tour is not available for booking');
    }
    return tour;
  }

  async findBookableTourForUpdate(tourId, client) {
    const result = await client.query(
      `SELECT *
       FROM tour
       WHERE tour_id = $1
         AND deleted_at IS NULL
       FOR UPDATE`,
      [tourId]
    );

    return result.rows[0] || null;
  }

  async ensureCustomerExists(userId, client = db) {
    const result = await client.query(
      `SELECT user_id
       FROM users
       WHERE user_id = $1
         AND role = 'customer'
         AND status = 'active'`,
      [userId]
    );

    if (!result.rows[0]) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Customer does not exist or is not active');
    }
  }

  async ensureTourHasCapacity(tour, requestedSlots, client = db) {
    const result = await client.query(
      `SELECT COUNT(bd.booking_detail_id)::int AS booked_slots
       FROM booking b
       INNER JOIN booking_detail bd ON bd.booking_id = b.booking_id
       WHERE b.tour_id = $1
         AND b.status = ANY($2)`,
      [tour.tour_id, ACTIVE_BOOKING_STATUSES]
    );

    const bookedSlots = Number(result.rows[0].booked_slots || 0);
    const availableSlots = Number(tour.capacity || 0) - bookedSlots;
    if (requestedSlots > availableSlots) {
      throw new ApiError(httpStatus.CONFLICT, 'Not enough available slots for this tour', {
        capacity: Number(tour.capacity || 0),
        booked_slots: bookedSlots,
        available_slots: availableSlots,
        requested_slots: requestedSlots,
      });
    }
  }

  async getForUser(id, userId) {
    const result = await db.query(
      'SELECT * FROM booking WHERE booking_id = $1 AND user_id = $2',
      [id, userId]
    );
    const booking = result.rows[0];
    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }
    return booking;
  }

  createForUser(payload, userId) {
    return this.create({
      ...payload,
      user_id: userId,
    });
  }

  async updateForUser(id, userId, payload) {
    await this.getForUser(id, userId);
    const booking = await this.model.update(id, {
      ...payload,
      user_id: userId,
    });
    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }
    return booking;
  }

  async removeForUser(id, userId) {
    await this.getForUser(id, userId);
    const booking = await this.model.remove(id);
    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }
    return booking;
  }

  async cancel(id, options = {}) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const values = [id];
      let ownerClause = '';
      if (options.userId) {
        values.push(options.userId);
        ownerClause = `AND user_id = $${values.length}`;
      }

      const bookingResult = await client.query(
        `SELECT *
         FROM booking
         WHERE booking_id = $1
           ${ownerClause}
         FOR UPDATE`,
        values
      );
      const booking = bookingResult.rows[0];

      if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
      }

      if (['canceled', 'expired'].includes(booking.status)) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Booking is already ${booking.status}`);
      }

      const paidPaymentResult = await client.query(
        `SELECT payment_id
         FROM payment
         WHERE booking_id = $1
           AND status = 'paid'
           AND deleted_at IS NULL
         LIMIT 1`,
        [id]
      );

      if (booking.payment_status === 'paid' || paidPaymentResult.rows[0]) {
        throw new ApiError(httpStatus.CONFLICT, 'Paid booking requires staff refund before cancellation');
      }

      const pendingPaymentResult = await client.query(
        `UPDATE payment
         SET status = 'expired',
             updated_at = CURRENT_TIMESTAMP
         WHERE booking_id = $1
           AND status = 'pending'
           AND deleted_at IS NULL
         RETURNING payment_id`,
        [id]
      );

      const nextPaymentStatus = pendingPaymentResult.rowCount > 0
        ? 'failed'
        : booking.payment_status;

      const canceledResult = await client.query(
        `UPDATE booking
         SET status = 'canceled',
             payment_status = $2
         WHERE booking_id = $1
         RETURNING *`,
        [id, nextPaymentStatus]
      );

      await client.query('COMMIT');
      return canceledResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async cancelForUser(id, userId) {
    return this.cancel(id, { userId });
  }
}

module.exports = new BookingService(bookingModel);

