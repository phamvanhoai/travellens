const bcrypt = require('bcryptjs');
const BaseService = require('./base.service');
const userModel = require('../models/user.model');

const sanitize = (user) => {
  if (!user) return user;
  const { password, ...safeUser } = user;
  return safeUser;
};

class UserService extends BaseService {
  async list(query) {
    const users = await this.model.findAll(query);
    return users.map(sanitize);
  }

  async get(id) {
    return sanitize(await super.get(id));
  }

  async create(payload) {
    const nextPayload = { ...payload };
    if (nextPayload.password) {
      nextPayload.password = await bcrypt.hash(nextPayload.password, 10);
    }
    return sanitize(await this.model.create(nextPayload));
  }

  async update(id, payload) {
    const nextPayload = { ...payload };
    if (nextPayload.password) {
      nextPayload.password = await bcrypt.hash(nextPayload.password, 10);
    }
    return sanitize(await super.update(id, nextPayload));
  }
}

module.exports = new UserService(userModel);
