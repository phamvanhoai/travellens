const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const userModel = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const sanitizeUser = (user) => {
  if (!user) return user;
  const { password, ...safeUser } = user;
  return safeUser;
};

const signToken = (user) => jwt.sign(
  { sub: user.user_id, role: user.role, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

class AuthService {
  async register(payload) {
    const email = payload.email.toLowerCase().trim();
    const exists = await db.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (exists.rows[0]) {
      throw new ApiError(httpStatus.CONFLICT, 'Email already exists');
    }

    try {
      const hashedPassword = await bcrypt.hash(payload.password, 10);
      const user = await userModel.create({
        name: payload.name.trim(),
        email,
        password: hashedPassword,
        role: 'customer',
        status: 'active',
        profile_info: payload.profile_info,
        avatar_url: payload.avatar_url,
      });

      return {
        user: sanitizeUser(user),
        token: signToken(user),
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Email already exists');
      }
      throw error;
    }
  }

  async login({ email, password }) {
    const user = await userModel.findByEmail(email);
    if (!user || !user.password) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    if (user.status && user.status !== 'active') {
      throw new ApiError(httpStatus.FORBIDDEN, 'Account is not active');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    return {
      user: sanitizeUser(user),
      token: signToken(user),
    };
  }

  async googleLogin(payload) {
    if (!payload.email || !payload.google_id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Google profile requires email and google_id');
    }

    const found = await db.query('SELECT * FROM users WHERE email = $1 OR google_id = $2', [payload.email, payload.google_id]);
    let user = found.rows[0];

    if (!user) {
      user = await userModel.create({
        name: payload.name || payload.email,
        email: payload.email,
        role: 'customer',
        status: 'active',
        google_id: payload.google_id,
        avatar_url: payload.avatar_url,
      });
    } else if (!user.google_id) {
      user = await userModel.update(user.user_id, {
        google_id: payload.google_id,
        avatar_url: payload.avatar_url || user.avatar_url,
      });
    }

    return {
      user: sanitizeUser(user),
      token: signToken(user),
    };
  }

  async getProfile(userId) {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return sanitizeUser(user);
  }

  async updateProfile(userId, payload) {
    const user = await userModel.update(userId, {
      name: payload.name,
      profile_info: payload.profile_info,
      avatar_url: payload.avatar_url,
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return sanitizeUser(user);
  }
}

module.exports = new AuthService();
