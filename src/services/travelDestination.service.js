const travelDestinationModel = require('../models/travelDestination.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUploadedFile } = require('../utils/uploadedFile');
const richTextService = require('./richText.service');

class TravelDestinationService {
  async list(query = {}) {
    return travelDestinationModel.findAllWithPagination(query);
  }

  async get(id) {
    const destination = await travelDestinationModel.findDetailById(id);
    if (!destination) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Travel destination not found');
    }

    const [locations, tours, view360, statistics] = await Promise.all([
      travelDestinationModel.getLocations(id),
      travelDestinationModel.getTours(id),
      travelDestinationModel.getView360(id),
      travelDestinationModel.getStatistics(id),
    ]);

    return {
      ...destination,
      locations,
      tours,
      view360,
      statistics,
    };
  }

  async create(payload) {
    const nextPayload = {
      ...payload,
      description: await richTextService.prepare(
        payload.description,
        'Travel destination description'
      ),
    };

    await this.ensureUniqueName(nextPayload.name);
    await this.ensureDestinationCategoryExists(nextPayload.destination_category_id);

    try {
      return await travelDestinationModel.createDestination(nextPayload);
    } catch (error) {
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Travel destination name already exists');
      }
      if (error.code === '23503') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Destination category does not exist');
      }
      throw error;
    }
  }

  async update(id, payload) {
    const current = await this.ensureExists(id);
    const nextPayload = { ...payload };

    if (nextPayload.description !== undefined) {
      nextPayload.description = await richTextService.prepare(
        nextPayload.description,
        'Travel destination description'
      );
    }

    if (nextPayload.name) {
      await this.ensureUniqueName(nextPayload.name, id);
    }

    await this.ensureDestinationCategoryExists(nextPayload.destination_category_id);

    try {
      const destination = await travelDestinationModel.updateDestination(id, nextPayload);
      if (!destination) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Travel destination not found');
      }

      if (
        nextPayload.thumbnail
        && current.thumbnail
        && current.thumbnail !== destination.thumbnail
      ) {
        await removeUploadedFile(current.thumbnail);
      }

      return destination;
    } catch (error) {
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Travel destination name already exists');
      }
      if (error.code === '23503') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Destination category does not exist');
      }
      throw error;
    }
  }

  async remove(id) {
    const current = await this.ensureExists(id);

    const relations = await travelDestinationModel.countRelations(id);
    if (relations.total_tours > 0 || relations.total_locations > 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Cannot delete travel destination while tours or locations still exist',
        relations
      );
    }

    const destination = await travelDestinationModel.softDeleteDestination(id);
    if (!destination) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Travel destination not found');
    }

    await removeUploadedFile(current.thumbnail);

    return destination;
  }

  async ensureExists(id) {
    const destination = await travelDestinationModel.findActiveById(id);
    if (!destination) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Travel destination not found');
    }
    return destination;
  }

  async ensureUniqueName(name, exceptDestinationId) {
    const duplicate = await travelDestinationModel.findDuplicateName(name, exceptDestinationId);
    if (duplicate) {
      throw new ApiError(httpStatus.CONFLICT, 'Travel destination name already exists');
    }
  }

  async ensureDestinationCategoryExists(destinationCategoryId) {
    const exists = await travelDestinationModel.destinationCategoryExists(destinationCategoryId);
    if (!exists) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Destination category does not exist');
    }
  }
}

module.exports = new TravelDestinationService();

