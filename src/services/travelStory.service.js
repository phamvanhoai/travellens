const model = require('../models/travelStory.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUploadedFile } = require('../utils/uploadedFile');

class TravelStoryService {
  list(userId, role, query) { return model.listActive(userId, role, query); }
  listMine(userId, query) { return model.listOwned(userId, query); }

  async get(id, userId, role = 'customer') {
    const story = await model.findActiveById(id, userId, role);
    if (!story) throw new ApiError(httpStatus.NOT_FOUND, 'Travel story not found or expired');
    return story;
  }

  async create(userId, payload) {
    const created = await model.create(userId, payload);
    return this.get(created.story_id, userId);
  }

  async view(id, userId) {
    const story = await this.get(id, userId);
    const view = Number(story.user_id) === Number(userId) ? null : await model.addView(id, userId);
    return {
      ...(await this.get(id, userId)),
      view_recorded: Boolean(view),
    };
  }

  async viewers(id, userId, query) {
    const result = await model.listViewersOwned(id, userId, query);
    if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Travel story not found or not owned by customer');
    return result;
  }

  async remove(id, userId) {
    const story = await model.softDeleteOwned(id, userId);
    if (!story) throw new ApiError(httpStatus.NOT_FOUND, 'Travel story not found or not owned by customer');
    await removeUploadedFile(story.media_url);
    return { story_id: Number(story.story_id), deleted: true };
  }
}

module.exports = new TravelStoryService();
