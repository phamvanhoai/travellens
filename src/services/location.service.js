const locationModel = require('../models/location.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUploadedFile } = require('../utils/uploadedFile');

class LocationService {
  async list(query = {}) {
    return locationModel.findAllWithPagination(query);
  }

  async get(id) {
    const location = await locationModel.findActiveById(id);
    if (!location) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }
    return location;
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

      if (payload.name) {
        await this.ensureUniqueName(current.destination_id, payload.name, id, client);
      }

      const location = await locationModel.updateLocation(id, {
        ...payload,
        name: payload.name ? payload.name.trim() : undefined,
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

