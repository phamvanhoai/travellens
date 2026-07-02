const locationModel = require('../models/location.model');
const weatherService = require('./weather.service');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUploadedFile } = require('../utils/uploadedFile');

class LocationService {
  async list(query = {}) {
    return locationModel.findAllWithPagination(query);
  }

  async get(id) {
    const location = await locationModel.findDetailById(id);
    if (!location) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }

    const [maps, view360, reviews] = await Promise.all([
      locationModel.findMapsByLocation(id),
      locationModel.findView360ByLocation(id),
      locationModel.findReviewsByLocation(id),
    ]);

    return {
      ...location,
      maps,
      Maps: maps,
      view360,
      view360s: view360,
      View360s: view360,
      reviews,
      Reviews: reviews,
    };
  }

  async getWeather(id) {
    const location = await this.get(id);
    const hasCoordinates = location.latitude !== null
      && location.latitude !== undefined
      && location.longitude !== null
      && location.longitude !== undefined;

    if (!hasCoordinates) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Location coordinates are required');
    }

    const weather = await weatherService.getCurrentByCoordinates(
      location.latitude,
      location.longitude
    );

    return {
      location_id: location.location_id,
      location_name: location.name,
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
      weather,
    };
  }

  async create(payload) {
    const destinationId = payload.travel_destination_id || payload.destination_id;
    const client = await locationModel.getClient();

    try {
      await client.query('BEGIN');
      await this.ensureTravelDestinationExists(destinationId, client);
      await this.ensureUniqueName(destinationId, payload.name, null, client);

      const location = await locationModel.createLocation({
        destination_id: destinationId,
        name: payload.name.trim(),
        description: payload.description,
        latitude: payload.latitude,
        longitude: payload.longitude,
        thumbnail: payload.thumbnail,
      }, client);

      await client.query('COMMIT');
      return location;
    } catch (error) {
      await client.query('ROLLBACK');
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Duplicate location name inside same destination');
      }
      if (error.code === '23503') {
        throw new ApiError(httpStatus.NOT_FOUND, 'Travel destination not found');
      }
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id, payload) {
    const client = await locationModel.getClient();

    try {
      await client.query('BEGIN');
      const current = await this.ensureExists(id, client);
      const destinationId = payload.travel_destination_id ?? current.destination_id;
      const name = payload.name ? payload.name.trim() : current.name;

      if (payload.travel_destination_id !== undefined) {
        await this.ensureTravelDestinationExists(destinationId, client);
      }

      if (payload.name || payload.travel_destination_id !== undefined) {
        await this.ensureUniqueName(destinationId, name, id, client);
      }

      const location = await locationModel.updateLocation(id, {
        ...payload,
        destination_id: payload.travel_destination_id !== undefined ? destinationId : undefined,
        travel_destination_id: undefined,
        name: payload.name ? name : undefined,
      }, client);

      await client.query('COMMIT');

      if (
        payload.thumbnail
        && current.thumbnail
        && current.thumbnail !== location.thumbnail
      ) {
        await removeUploadedFile(current.thumbnail);
      }

      return location;
    } catch (error) {
      await client.query('ROLLBACK');
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Duplicate location name inside same destination');
      }
      if (error.code === '23503') {
        throw new ApiError(httpStatus.NOT_FOUND, 'Travel destination not found');
      }
      throw error;
    } finally {
      client.release();
    }
  }

  async remove(id) {
    const client = await locationModel.getClient();

    try {
      await client.query('BEGIN');
      const current = await this.ensureExists(id, client);

      const relations = await locationModel.countRelatedData(id, client);
      const hasRelatedData = Object.values(relations).some((total) => Number(total) > 0);
      if (hasRelatedData) {
        throw new ApiError(httpStatus.CONFLICT, 'Location has related data', relations);
      }

      const location = await locationModel.softDeleteLocation(id, client);
      if (!location) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
      }

      await client.query('COMMIT');

      await removeUploadedFile(current.thumbnail);

      return location;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async ensureExists(id, executor) {
    const location = await locationModel.findActiveById(id, executor);
    if (!location) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }
    return location;
  }

  async ensureTravelDestinationExists(destinationId, executor) {
    const exists = await locationModel.travelDestinationExists(destinationId, executor);
    if (!exists) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Travel destination not found');
    }
  }

  async ensureUniqueName(destinationId, name, exceptLocationId, executor) {
    const duplicate = await locationModel.findDuplicateName(destinationId, name, exceptLocationId, executor);
    if (duplicate) {
      throw new ApiError(httpStatus.CONFLICT, 'Duplicate location name inside same destination');
    }
  }
}

module.exports = new LocationService();

