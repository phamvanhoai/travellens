const bcrypt = require('bcryptjs');
const BaseService = require('./base.service');
const userModel = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUserAvatar } = require('../utils/avatarFile');

const sanitize = (user) => {
  if (!user) return user;
  const { password, ...safeUser } = user;
  return safeUser;
};

class UserService extends BaseService {
  async list(query) {
    const result = await this.model.findAllWithPagination(query);
    return {
      ...result,
      items: result.items.map(sanitize),
    };
  }

  async get(id) {
    return sanitize(await super.get(id));
  }

  async create(payload) {
    const nextPayload = { ...payload };
    nextPayload.name = nextPayload.name.trim();
    nextPayload.email = nextPayload.email.toLowerCase().trim();

    const exists = await this.model.existsByEmail(nextPayload.email);
    if (exists) {
      throw new ApiError(httpStatus.CONFLICT, 'Email already exists');
    }

    if (nextPayload.password) {
      nextPayload.password = await bcrypt.hash(nextPayload.password, 10);
    }

    try {
      return sanitize(await this.model.create(nextPayload));
    } catch (error) {
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Email already exists');
      }

      throw error;
    }
  }

  async update(id, payload) {
    const nextPayload = { ...payload };
    const currentUser = nextPayload.avatar_url
      ? await this.model.findById(id)
      : null;

    if (nextPayload.name) {
      nextPayload.name = nextPayload.name.trim();
    }

    if (nextPayload.email) {
      nextPayload.email = nextPayload.email.toLowerCase().trim();
      const existing = await this.model.findByEmail(nextPayload.email);
      if (existing && Number(existing.user_id) !== Number(id)) {
        throw new ApiError(httpStatus.CONFLICT, 'Email already exists');
      }
    }

    if (nextPayload.password) {
      nextPayload.password = await bcrypt.hash(nextPayload.password, 10);
    }

    try {
      const user = await super.update(id, nextPayload);

      if (
        nextPayload.avatar_url
        && currentUser?.avatar_url
        && user?.avatar_url
        && currentUser.avatar_url !== user.avatar_url
      ) {
        await removeUserAvatar(currentUser.avatar_url);
      }

      return sanitize(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Email already exists');
      }

      throw error;
    }
  }
}

module.exports = new UserService(userModel);
