const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { auth } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *
 * /auth/register:
 *   post:
 *     summary: Register a new user account
 *     description: Creates a user account with role `user`, hashes the password, and returns a JWT access token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyen Van A
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: secret123
 *               profile_info:
 *                 type: string
 *                 nullable: true
 *                 example: Travel lover from Da Nang
 *               avatar_url:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 example: https://example.com/avatar.png
 *     responses:
 *       201:
 *         description: Registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Nguyen Van A
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         role:
 *                           type: string
 *                           example: user
 *                         status:
 *                           type: string
 *                           example: active
 *                         profile_info:
 *                           type: string
 *                           nullable: true
 *                         avatar_url:
 *                           type: string
 *                           nullable: true
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post('/register', validate(auth.register), authController.register);
router.post('/verify-email', validate(auth.verifyEmail), authController.verifyEmail);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     description: Authenticates an active account and returns the user profile with a JWT access token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Nguyen Van A
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         role:
 *                           type: string
 *                           example: user
 *                         status:
 *                           type: string
 *                           example: active
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account is not active
 */
router.post('/login', validate(auth.login), authController.login);
router.post('/google', validate(auth.googleLogin), authController.googleLogin);
router.post('/logout', authenticate, authController.logout);
router.post('/forgot-password', validate(auth.forgotPassword), authController.forgotPassword);
router.post('/verify-reset-code', validate(auth.verifyResetCode), authController.verifyResetCode);
router.post('/reset-password', validate(auth.resetPassword), authController.resetPassword);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the latest profile of the authenticated user.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Nguyen Van A
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     role:
 *                       type: string
 *                       example: user
 *                     status:
 *                       type: string
 *                       example: active
 *                     profile_info:
 *                       type: string
 *                       nullable: true
 *                       example: Travel lover from Da Nang
 *                     google_id:
 *                       type: string
 *                       nullable: true
 *                     avatar_url:
 *                       type: string
 *                       nullable: true
 *       401:
 *         description: Authentication required
 *   put:
 *     summary: Update current user profile
 *     description: Updates profile fields for the authenticated user. Email, password, role, and status are not updated here.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyen Van A
 *               profile_info:
 *                 type: string
 *                 nullable: true
 *                 example: Loves beaches and mountain trips
 *               avatar_url:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 example: https://example.com/avatar.png
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router
  .route('/profile')
  .get(authenticate, authController.profile)
  .put(authenticate, validate(auth.updateProfile), authController.updateProfile);

module.exports = router;
