const ApiError = require('../utils/ApiError');
const { httpStatus, messages } = require('../constants');

class BaseService {
  constructor(model) {
    this.model = model;
  }

  list(query) {
    return this.model.findAll(query);
  }

  async get(id) {
    const item = await this.model.findById(id);
    if (!item) {
      throw new ApiError(httpStatus.NOT_FOUND, messages.NOT_FOUND);
    }
    return item;
  }

  create(payload) {
    return this.model.create(payload);
  }

  async update(id, payload) {
    const item = await this.model.update(id, payload);
    if (!item) {
      throw new ApiError(httpStatus.NOT_FOUND, messages.NOT_FOUND);
    }
    return item;
  }

  async remove(id) {
    const item = await this.model.remove(id);
    if (!item) {
      throw new ApiError(httpStatus.NOT_FOUND, messages.NOT_FOUND);
    }
    return item;
  }
}

module.exports = BaseService;

