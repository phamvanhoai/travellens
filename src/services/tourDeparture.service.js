const tourDepartureModel = require('../models/tourDeparture.model');
const tourModel = require('../models/tour.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class TourDepartureService {
  listPublic(tourId) { return tourDepartureModel.listByTour(tourId, { publicOnly: true }); }
  listAdmin(tourId, query = {}) { return tourDepartureModel.listByTour(tourId, { page: Number(query.page || 1), limit: Number(query.limit || 10), search: query.search?.trim(), status: query.status, dateFrom: query.date_from, dateTo: query.date_to }); }

  async create(tourId, payload) {
    const tour = await tourModel.findRawById(tourId);
    if (!tour) throw new ApiError(httpStatus.NOT_FOUND, 'Tour not found');
    const next = {
      ...payload,
      tour_id: Number(tourId),
      capacity: payload.capacity ?? tour.capacity,
      price: payload.price ?? tour.price,
      child_price: payload.child_price ?? tour.child_price ?? Number(tour.price) * 0.65,
      infant_price: payload.infant_price ?? tour.infant_price ?? 0,
      currency: payload.currency ?? tour.currency ?? 'VND',
      status: payload.status ?? 'draft',
    };
    this.validateRules(next);
    return tourDepartureModel.create(next);
  }

  async bulkCreate(tourId, payload) {
    const tour = await tourModel.findRawById(tourId);
    if (!tour) throw new ApiError(httpStatus.NOT_FOUND, 'Tour not found');
    const start = parseDateOnly(payload.start_date);
    const end = parseDateOnly(payload.end_date);
    if (end < start) throw new ApiError(httpStatus.BAD_REQUEST, 'End date cannot be before start date');
    const totalDays = Math.floor((end - start) / 86400000) + 1;
    if (totalDays > 366) throw new ApiError(httpStatus.BAD_REQUEST, 'A bulk schedule cannot span more than 366 days');

    const weekdays = new Set(payload.weekdays.map(Number));
    const items = [];
    for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
      if (!weekdays.has(cursor.getUTCDay())) continue;
      const date = cursor.toISOString().slice(0, 10);
      const departureAt = new Date(`${date}T${payload.departure_time}:00+07:00`);
      const bookingCloseAt = payload.booking_close_hours_before == null
        ? null
        : new Date(departureAt.getTime() - Number(payload.booking_close_hours_before) * 3600000);
      const next = {
        tour_id: Number(tourId), departure_at: departureAt.toISOString(),
        capacity: payload.capacity ?? tour.capacity, price: payload.price ?? tour.price,
        child_price: payload.child_price ?? tour.child_price ?? Number(tour.price) * 0.65,
        infant_price: payload.infant_price ?? tour.infant_price ?? 0,
        currency: payload.currency ?? tour.currency ?? 'VND', booking_open_at: payload.booking_open_at ?? null,
        booking_close_at: bookingCloseAt?.toISOString() ?? null, status: payload.status ?? 'draft',
      };
      this.validateRules(next);
      items.push(next);
    }
    if (!items.length) throw new ApiError(httpStatus.BAD_REQUEST, 'The selected weekdays do not produce any departures in this date range');
    const created = await tourDepartureModel.bulkCreate(items);
    return { created_count: created.length, skipped_count: items.length - created.length, requested_count: items.length, departures: created };
  }

  async update(tourId, id, payload) {
    const current = await tourDepartureModel.findById(id);
    if (!current || Number(current.tour_id) !== Number(tourId)) throw new ApiError(httpStatus.NOT_FOUND, 'Tour departure not found');
    const bookedSlots = await tourDepartureModel.countBookedSlots(id);
    const bookingCount = await tourDepartureModel.countBookings(id);
    if (payload.capacity !== undefined && Number(payload.capacity) < bookedSlots) {
      throw new ApiError(httpStatus.CONFLICT, `Capacity cannot be lower than ${bookedSlots} booked slots`);
    }
    if (bookingCount > 0 && payload.departure_at && new Date(payload.departure_at).getTime() !== new Date(current.departure_at).getTime()) {
      throw new ApiError(httpStatus.CONFLICT, 'Departure time cannot be changed after bookings exist');
    }
    if (bookedSlots > 0 && payload.status === 'cancelled') {
      throw new ApiError(httpStatus.CONFLICT, 'Departure with active bookings cannot be cancelled until those bookings are resolved; close sales instead');
    }
    if (payload.status === 'open' && new Date(payload.departure_at || current.departure_at).getTime() <= Date.now()) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'A past departure cannot be opened for booking');
    }
    this.validateRules({ ...current, ...payload });
    return tourDepartureModel.update(id, payload);
  }

  async remove(tourId, id) {
    const current = await tourDepartureModel.findById(id);
    if (!current || Number(current.tour_id) !== Number(tourId)) throw new ApiError(httpStatus.NOT_FOUND, 'Tour departure not found');
    if (await tourDepartureModel.countBookings(id)) throw new ApiError(httpStatus.CONFLICT, 'Departure with bookings cannot be deleted; close or cancel it instead');
    return tourDepartureModel.softDelete(id);
  }

  validateRules(payload) {
    const departureAt = new Date(payload.departure_at).getTime();
    const openAt = payload.booking_open_at ? new Date(payload.booking_open_at).getTime() : null;
    const closeAt = payload.booking_close_at ? new Date(payload.booking_close_at).getTime() : null;
    if (!Number.isFinite(departureAt)) throw new ApiError(httpStatus.BAD_REQUEST, 'Departure time is invalid');
    if (openAt !== null && closeAt !== null && openAt >= closeAt) throw new ApiError(httpStatus.BAD_REQUEST, 'Booking open time must be before booking close time');
    if (closeAt !== null && closeAt > departureAt) throw new ApiError(httpStatus.BAD_REQUEST, 'Booking close time cannot be after departure');
    if (payload.status === 'open' && departureAt <= Date.now()) throw new ApiError(httpStatus.BAD_REQUEST, 'A past departure cannot be opened for booking');
    if (String(payload.currency || 'VND').toUpperCase() !== 'VND') throw new ApiError(httpStatus.BAD_REQUEST, 'Only VND departures are supported');
  }
}

function parseDateOnly(value) {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime())) throw new ApiError(httpStatus.BAD_REQUEST, 'Date range is invalid');
  return date;
}

module.exports = new TourDepartureService();
