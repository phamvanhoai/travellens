const db = require('../config/db');
const BaseService = require('./base.service');
const tourModel = require('../models/tour.model');
const tourDestinationModel = require('../models/tourDestination.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUploadedFile } = require('../utils/uploadedFile');

class TourService extends BaseService {
  async viewTourList(query = {}) {
    return this.model.findAllForAdminView(query);
  }

  async viewTourDetail(id) {
    const item = await this.model.findDetailForAdminView(id);
    if (!item) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Tour Not Found');
    }
    return item;
  }

  async publicList(query = {}) {
    return this.model.findAllForAdminView({
      ...query,
      status: 'active',
    });
  }

  async publicDetail(id) {
    const item = await this.model.findDetailForAdminView(id);
    if (!item || item.status !== 'active') {
      throw new ApiError(httpStatus.NOT_FOUND, 'Tour Not Found');
    }
    return item;
  }

  async create(payload) {
    this.validateDestinationList(payload.destinations);

    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      await this.ensureTourCategoryExists(payload.tour_category_id, client);
      await this.ensureDestinationsExist(payload.destinations, client);
      await this.ensureTourNameIsUnique(payload.name, null, client);

      const tour = await this.model.createTour(payload, client);
      await tourDestinationModel.replaceForTour(tour.tour_id, payload.destinations, client);

      await client.query('COMMIT');
      return { tour_id: tour.tour_id };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id, payload) {
    if (payload.destinations) {
      this.validateDestinationList(payload.destinations);
    }

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const existingTour = await this.model.findRawById(id, client);
      if (!existingTour) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Tour Not Found');
      }

      if (payload.tour_category_id !== undefined) {
        await this.ensureTourCategoryExists(payload.tour_category_id, client);
      }

      if (payload.destinations) {
        await this.ensureDestinationsExist(payload.destinations, client);
      }

      if (payload.name !== undefined) {
        await this.ensureTourNameIsUnique(payload.name, id, client);
      }

      if (payload.capacity !== undefined) {
        const bookedSlots = await this.model.countBookedSlots(id, client);
        if (Number(payload.capacity) < bookedSlots) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Capacity cannot be lower than current booked slots.');
        }
      }

      const tour = await this.model.updateTour(id, payload, client);
      if (!tour) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Tour Not Found');
      }

      if (payload.destinations) {
        await tourDestinationModel.replaceForTour(id, payload.destinations, client);
      }

      await client.query('COMMIT');

      if (
        payload.thumbnail
        && existingTour.thumbnail
        && existingTour.thumbnail !== payload.thumbnail
      ) {
        await removeUploadedFile(existingTour.thumbnail);
      }

      return { tour_id: Number(id) };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async remove(id) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const existingTour = await this.model.findRawById(id, client);
      if (!existingTour) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Tour Not Found');
      }

      const activeBookings = await this.model.countActiveBookings(id, client);
      if (activeBookings > 0) {
        throw new ApiError(httpStatus.CONFLICT, 'Cannot delete tour because it has active bookings');
      }

      await this.model.softDelete(id, client);
      await client.query('COMMIT');

      await removeUploadedFile(existingTour.thumbnail);

      return { tour_id: Number(id) };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  validateDestinationList(destinations) {
    const destinationIds = new Set();
    const orderIndexes = new Set();

    for (const destination of destinations) {
      if (destinationIds.has(destination.destination_id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Duplicate destination_id inside one tour is not allowed');
      }
      if (orderIndexes.has(destination.order_index)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'order_index must be unique inside one tour');
      }

      destinationIds.add(destination.destination_id);
      orderIndexes.add(destination.order_index);
    }
  }

  async ensureTourCategoryExists(tourCategoryId, client = db) {
    const result = await client.query(
      'SELECT tour_category_id FROM tour_category WHERE tour_category_id = $1',
      [tourCategoryId]
    );
    if (!result.rows[0]) {
      throw new ApiError(httpStatus.NOT_FOUND, 'TourCategory Not Found');
    }
  }

  async ensureDestinationsExist(destinations, client = db) {
    const destinationIds = destinations.map((destination) => destination.destination_id);
    const result = await client.query(
      `SELECT destination_id
       FROM travel_destination
       WHERE destination_id = ANY($1)
         AND deleted_at IS NULL`,
      [destinationIds]
    );

    if (result.rows.length !== destinationIds.length) {
      throw new ApiError(httpStatus.NOT_FOUND, 'TravelDestination Not Found');
    }
  }

  async ensureTourNameIsUnique(name, excludeTourId, client = db) {
    const existingTour = await this.model.findByName(name, excludeTourId, client);
    if (existingTour) {
      throw new ApiError(httpStatus.CONFLICT, 'Duplicate Tour');
    }
  }
}

module.exports = new TourService(tourModel);
