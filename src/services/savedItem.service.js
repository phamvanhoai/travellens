const savedTourModel = require('../models/savedTour.model');
const savedDestinationModel = require('../models/savedDestination.model');
const tourModel = require('../models/tour.model');
const travelDestinationModel = require('../models/travelDestination.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class SavedItemService {
  async getSavedIds(userId) {
    const tours = await savedTourModel.findSavedIdsByUser(userId);
    const destinations = await savedDestinationModel.findSavedIdsByUser(userId);
    return {
      tours,
      destinations
    };
  }

  async toggleTour(userId, tourId) {
    // findRawById checks deleted_at IS NULL
    const tour = await tourModel.findRawById(tourId);
    if (!tour) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Tour Not Found');
    }

    const isSaved = await savedTourModel.isSaved(userId, tourId);
    if (isSaved) {
      await savedTourModel.unsave(userId, tourId);
      return { saved: false };
    } else {
      await savedTourModel.save(userId, tourId);
      return { saved: true };
    }
  }

  async toggleDestination(userId, destinationId) {
    // findActiveById checks deleted_at IS NULL
    const destination = await travelDestinationModel.findActiveById(destinationId);
    if (!destination) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Destination Not Found');
    }

    const isSaved = await savedDestinationModel.isSaved(userId, destinationId);
    if (isSaved) {
      await savedDestinationModel.unsave(userId, destinationId);
      return { saved: false };
    } else {
      await savedDestinationModel.save(userId, destinationId);
      return { saved: true };
    }
  }

  async listTours(userId, query) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
    const offset = (page - 1) * limit;

    const result = await savedTourModel.getSavedToursList(userId, limit, offset);

    return {
      items: result.items,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }

  async listDestinations(userId, query) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
    const offset = (page - 1) * limit;

    const result = await savedDestinationModel.getSavedDestinationsList(userId, limit, offset);

    return {
      items: result.items,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}

module.exports = new SavedItemService();
