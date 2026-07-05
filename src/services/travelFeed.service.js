const travelPostModel = require('../models/travelPost.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class TravelFeedService {
  async list(userId, query = {}) {
    const result = await travelPostModel.listFeed(query, userId);

    return {
      items: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  async create(userId, payload = {}, files = []) {
    const content = typeof payload.content === 'string' ? payload.content.trim() : '';
    const photos = files.filter((file) => file.url);

    if (!content && !photos.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Post content or at least one photo is required');
    }

    const client = await travelPostModel.getClient();

    try {
      await client.query('BEGIN');

      let destinationId = payload.destination_id ? Number(payload.destination_id) : null;
      const locationId = payload.location_id ? Number(payload.location_id) : null;

      if (locationId) {
        const location = await travelPostModel.findActiveLocation(locationId, client);

        if (!location) {
          throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
        }

        if (destinationId && Number(location.destination_id) !== destinationId) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Location does not belong to the selected destination');
        }

        destinationId = Number(location.destination_id);
      }

      if (destinationId) {
        const destination = await travelPostModel.findActiveDestination(destinationId, client);

        if (!destination) {
          throw new ApiError(httpStatus.NOT_FOUND, 'Destination not found');
        }
      }

      const post = await travelPostModel.createPost({
        user_id: userId,
        content,
        destination_id: destinationId,
        location_id: locationId,
      }, client);

      await travelPostModel.addPhotos(post.post_id, photos, client);

      const created = await travelPostModel.findFeedPostById(post.post_id, userId, client);

      await client.query('COMMIT');

      return created;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new TravelFeedService();
