const model = require('../models/tourContentItem.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class TourContentItemService {
  list(query) { return model.findAll(query); }
  async get(id) {
    const item = await model.findById(id);
    if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Tour content item not found');
    return item;
  }
  async ensureUnique(payload, excludeId) {
    if (await model.findDuplicate(payload.type, payload.content, excludeId)) {
      throw new ApiError(httpStatus.CONFLICT, 'This tour content item already exists');
    }
  }
  async create(payload) {
    await this.ensureUnique(payload);
    return model.create(payload);
  }
  async update(id, payload) {
    const existing = await this.get(id);
    await this.ensureUnique({ type: payload.type || existing.type, content: payload.content || existing.content }, id);
    return model.update(id, payload);
  }
  async remove(id) {
    const item = await model.remove(id);
    if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Tour content item not found');
    return item;
  }
}

module.exports = new TourContentItemService();

