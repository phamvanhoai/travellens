const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const userModel = require('../models/user.model');
const revokedTokenModel = require('../models/revokedToken.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const emailVerificationTokenModel = require('../models/emailVerificationToken.model');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
        role: 'guest',
        status: 'pending',
        profile_info: payload.profile_info,
        avatar_url: payload.avatar_url,
      });

      const verification = await emailVerificationTokenModel.createToken(user.user_id);

      return {
        user: sanitizeUser(user),
        // token: signToken(user),
        verification_token: verification.rawToken,
        verification_url: `/api/auth/verify-email?token=${verification.rawToken}`,
        message: `Please verify your email to activate your account. Check your email for the verification link.`,
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ApiError(httpStatus.CONFLICT, 'Email already exists');
      }
      throw error;
    }
  }

  async verifyEmail(token) {
    if (!token) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Verification token is required');
    }

    const verificationToken = await emailVerificationTokenModel.findValidToken(token);

    if (!verificationToken) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired verification token');
    }

    const user = await userModel.verifyGuestUser(verificationToken.user_id);

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User is already verified or not a guest account');
    }

    await emailVerificationTokenModel.markAsUsed(verificationToken.verification_id);

    return {
      user: sanitizeUser(user),
      token: signToken(user),
    };
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
    if (!payload.id_token) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Google profile requires email and google_id');
    }

    let googlePayload;

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: payload.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      googlePayload = ticket.getPayload();
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Google ID token');
    }

    const email = googlePayload.email.toLowerCase().trim();
    const googleId = googlePayload.sub;
    const name = googlePayload.name || email;
    const avatarUrl = googlePayload.picture || null;

    if (!email || !googleId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Google profile requires email and google_id'
      );
    }

    let user = await userModel.findByEmailOrGoogleId(email, googleId);

    if (!user) {
      user = await userModel.create({
        name,
        email,
        google_id: googleId,
        avatar_url: avatarUrl,
        role: 'user',
        status: 'active',
      });
    } else if (!user.google_id) {
      user = await userModel.update(user.user_id, {
        google_id: googleId,
        avatar_url: avatarUrl || user.avatar_url,
      });
    }

    return {
      user: sanitizeUser(user),
      token: signToken(user),
    };
  }

  async logout(token, authUser) {
    if (!token || !authUser) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
    }

    const expiresAt = authUser.exp
      ? new Date(authUser.exp * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await revokedTokenModel.revoke({
      token,
      userId: authUser.sub,
      expiresAt,
    });

    return { message: 'Logged out successfully' };
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
