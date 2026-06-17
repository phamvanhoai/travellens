const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const BaseService = require('./base.service');
const userModel = require('../models/user.model');
const emailService = require('./email.service');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUserAvatar } = require('../utils/avatarFile');

const TEMP_PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const TEMP_PASSWORD_LENGTH = 12;

const sanitize = (user) => {
  if (!user) return user;
  const { password, ...safeUser } = user;
  return safeUser;
};

const generateTemporaryPassword = () => {
  let password = '';

  for (let index = 0; index < TEMP_PASSWORD_LENGTH; index += 1) {
    password += TEMP_PASSWORD_CHARS[crypto.randomInt(TEMP_PASSWORD_CHARS.length)];
  }

  return password;
};

const buildDeleteBlockDetails = (relations) => {
  const reasons = [];

  if (Number(relations.bookings) > 0) {
    reasons.push('User has booking history');
  }

  if (Number(relations.reviews) > 0) {
    reasons.push('User has active reviews');
  }

  if (Number(relations.blogs) > 0) {
    reasons.push('User has blogs');
  }

  if (Number(relations.coupons_created) > 0) {
    reasons.push('User has created coupons');
  }

  return {
    ...relations,
    reasons,
  };
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
    const providedPassword = typeof nextPayload.password === 'string'
      ? nextPayload.password.trim()
      : '';
    const isTemporaryPassword = !providedPassword;
    const plainPassword = providedPassword || generateTemporaryPassword();

    const exists = await this.model.existsByEmail(nextPayload.email);
    if (exists) {
      throw new ApiError(httpStatus.CONFLICT, 'Email already exists');
    }

    nextPayload.password = await bcrypt.hash(plainPassword, 10);

    try {
      const createdUser = await this.model.create(nextPayload);

      try {
        await emailService.sendAdminCreatedAccount({
          to: createdUser.email,
          name: createdUser.name,
          password: plainPassword,
          isTemporaryPassword,
        });
      } catch (emailError) {
        console.error('Failed to send admin created account email:', emailError);
      }

      return sanitize(createdUser);
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

  async remove(id) {
    const user = await this.get(id);

    if (user.role === 'admin') {
      throw new ApiError(httpStatus.FORBIDDEN, 'Admin users cannot be deleted', {
        role: user.role,
        reasons: ['Admin role is protected'],
      });
    }

    const relations = await this.model.countDeleteBlockingRelations(id);
    const hasBlockingRelations = Object.values(relations).some((total) => Number(total) > 0);

    if (hasBlockingRelations) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Cannot delete user because this account has related service data',
        buildDeleteBlockDetails(relations)
      );
    }

    try {
      const deletedUser = await super.remove(id);

      if (deletedUser?.avatar_url) {
        await removeUserAvatar(deletedUser.avatar_url);
      }

      return sanitize(deletedUser);
    } catch (error) {
      if (error.code === '23503') {
        throw new ApiError(
          httpStatus.CONFLICT,
          'Cannot delete user because this account is still referenced by other data',
          { reason: 'Foreign key constraint violation' }
        );
      }

      throw error;
    }
  }
}

module.exports = new UserService(userModel);
