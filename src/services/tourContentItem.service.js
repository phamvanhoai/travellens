const model = require('../models/tourContentItem.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class TourContentItemService {
  validateContent(type, content) {
    if (['highlight', 'requirement', 'inclusion', 'exclusion'].includes(type) && /[\r\n]/.test(content)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'List content must contain exactly one line');
    }
  }
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
    this.validateContent(payload.type, payload.content);
    await this.ensureUnique(payload);
    return model.create(payload);
  }
  async bulkCreate(payload) {
    payload.items.forEach((content) => this.validateContent(payload.type, content));
    const client = await model.getClient();
    try {
      await client.query('BEGIN');
      const errors = [];
      const seen = new Map();
      for (let index = 0; index < payload.items.length; index += 1) {
        const content = payload.items[index].trim();
        const normalized = model.normalizeContent(content);
        if (seen.has(normalized)) {
          errors.push({ index, content, reason: 'duplicate' });
          continue;
        }
        seen.set(normalized, index);
        if (await model.findDuplicate(payload.type, content, null, client)) {
          errors.push({ index, content, reason: 'duplicate' });
        }
      }
      if (errors.length) {
        throw new ApiError(httpStatus.CONFLICT, 'Some content items already exist', { errors });
      }
      const items = [];
      for (const content of payload.items) {
        items.push(await model.create({
          type: payload.type,
          content,
          status: payload.status,
        }, client));
      }
      await client.query('COMMIT');
      return items;
    } catch (error) {
      await client.query('ROLLBACK');
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Some content items already exist', { errors: [] });
      }
      throw error;
    } finally {
      client.release();
    }
  }
  async update(id, payload) {
    const existing = await this.get(id);
    this.validateContent(payload.type || existing.type, payload.content || existing.content);
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
