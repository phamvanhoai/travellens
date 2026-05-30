const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const statisticsController = require('../controllers/statistics.controller');
const view360Controller = require('../controllers/view360.controller');
const view360ImageController = require('../controllers/view360Image.controller');
const { view360, view360Image } = require('../validators');

const router = express.Router();

router.use(authenticate, authorize('admin'));

/**
 * @swagger
 * tags:
 *   - name: Admin Statistics
 *     description: Admin dashboard and reporting endpoints. Requires Bearer token with role `admin`.
 *   - name: Admin Users
 *     description: Admin user management. Requires Bearer token with role `admin`.
 *   - name: Admin Travel Destinations
 *     description: Admin travel destination management. Requires Bearer token with role `admin`.
 *   - name: Admin Destination Categories
 *     description: Admin destination category management. Requires Bearer token with role `admin`.
 *   - name: Admin Tour Categories
 *     description: Admin tour category management. Requires Bearer token with role `admin`.
 *
 * /admin/statistics/system:
 *   get:
 *     summary: View system statistics
 *     tags: [Admin Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *
 * /admin/statistics/users:
 *   get:
 *     summary: View user statistics
 *     tags: [Admin Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *
 * /admin/statistics/locations:
 *   get:
 *     summary: View location statistics
 *     tags: [Admin Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Location statistics
 *
 * /admin/statistics/content:
 *   get:
 *     summary: View content statistics
 *     tags: [Admin Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Content statistics
 */
router.get('/statistics/system', statisticsController.dashboard);
router.get('/statistics/users', statisticsController.users);
router.get('/statistics/locations', statisticsController.locations);
router.get('/statistics/content', statisticsController.content);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Admin list users
 *     description: Admin can view users with pagination, search, role/status filters, and sorting.
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         example: 10
 *       - in: query
 *         name: search
 *         description: Search by user name, email, phone, or address.
 *         schema:
 *           type: string
 *         example: nguyen
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, staff, user]
 *         example: user
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           maxLength: 50
 *         example: active
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [user_id, name, email, role, status, created_at, updated_at]
 *           default: created_at
 *         example: created_at
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         example: DESC
 *     responses:
 *       200:
 *         description: User list with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Nguyen Van A
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: user@example.com
 *                       role:
 *                         type: string
 *                         example: user
 *                       status:
 *                         type: string
 *                         example: active
 *                       profile_info:
 *                         type: string
 *                         nullable: true
 *                       google_id:
 *                         type: string
 *                         nullable: true
 *                       avatar_url:
 *                         type: string
 *                         nullable: true
 *                       phone:
 *                         type: string
 *                         nullable: true
 *                       date_of_birth:
 *                         type: string
 *                         format: date
 *                         nullable: true
 *                       gender:
 *                         type: string
 *                         nullable: true
 *                       address:
 *                         type: string
 *                         nullable: true
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *   post:
 *     summary: Admin create user
 *     description: Admin creates a user with a temporary password. The password is hashed by the backend before saving.
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role, status]
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 150
 *                 description: Must contain at least 2 words and letters/spaces only.
 *                 example: Nguyen Van A
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Must be at least 6 characters and not contain only spaces.
 *                 example: Temp123456
 *               role:
 *                 type: string
 *                 enum: [admin, staff, user]
 *                 example: user
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending]
 *                 example: active
 *               phone:
 *                 type: string
 *                 pattern: '^0(?:3|5|7|8|9)\\d{8}$'
 *                 nullable: true
 *                 example: "0901234567"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       409:
 *         description: Email already exists
 *
 * /admin/users/{id}:
 *   put:
 *     summary: Admin update user
 *     description: Admin updates one or more user fields. If password is provided, the backend hashes it before saving.
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 150
 *                 description: Must contain at least 2 words and letters/spaces only.
 *                 example: Nguyen Van B
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user.updated@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Must be at least 6 characters and not contain only spaces.
 *                 example: NewTemp123456
 *               role:
 *                 type: string
 *                 enum: [admin, staff, user]
 *                 example: staff
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending]
 *                 example: active
 *               phone:
 *                 type: string
 *                 pattern: '^0(?:3|5|7|8|9)\\d{8}$'
 *                 nullable: true
 *                 example: "0907654321"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin role required
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /admin/locations/{locationId}/view360:
 *   get:
 *     summary: Admin list View360 scenes by location
 *     tags: [Admin View360]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: View360 scene list
 *       404:
 *         description: Location not found
 *   post:
 *     summary: Admin create View360 scene
 *     tags: [Admin View360]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Main Gate 360 View
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: 360 experience at the main gate
 *               audio_file:
 *                 type: string
 *                 nullable: true
 *                 example: https://example.com/audio-url.mp3
 *               language:
 *                 type: string
 *                 default: vi
 *                 example: vi
 *               order_index:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: View360 created successfully
 *       404:
 *         description: Location not found
 *
 * /admin/view360/{viewId}:
 *   put:
 *     summary: Admin update View360 scene
 *     tags: [Admin View360]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: viewId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               title:
 *                 type: string
 *                 example: Main Gate 360 View Updated
 *               description:
 *                 type: string
 *                 nullable: true
 *               audio_file:
 *                 type: string
 *                 nullable: true
 *               language:
 *                 type: string
 *                 example: en
 *               order_index:
 *                 type: integer
 *                 nullable: true
 *                 example: 2
 *     responses:
 *       200:
 *         description: View360 updated successfully
 *   delete:
 *     summary: Admin soft delete View360 scene and related images
 *     tags: [Admin View360]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: viewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: View360 deleted successfully
 *
 * /admin/view360/{viewId}/images:
 *   get:
 *     summary: Admin list View360 images
 *     tags: [Admin View360]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: viewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: View360 image list
 *   post:
 *     summary: Admin add View360 image
 *     tags: [Admin View360]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: viewId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [image_file]
 *             properties:
 *               image_file:
 *                 type: string
 *                 example: https://example.com/image-360-url.jpg
 *               order_index:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: View360 image created successfully
 *
 * /admin/view360-images/{imageId}:
 *   put:
 *     summary: Admin update View360 image
 *     tags: [Admin View360]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               image_file:
 *                 type: string
 *                 example: https://example.com/image-360-updated.jpg
 *               order_index:
 *                 type: integer
 *                 nullable: true
 *                 example: 2
 *     responses:
 *       200:
 *         description: View360 image updated successfully
 *   delete:
 *     summary: Admin soft delete View360 image
 *     tags: [Admin View360]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: View360 image deleted successfully
 */
router
  .route('/locations/:locationId/view360')
  .get(validate(view360.locationParam), view360Controller.listByLocation)
  .post(validate(view360.create), view360Controller.createForLocation);

router
  .route('/view360/:viewId')
  .put(validate(view360.update), view360Controller.update)
  .delete(validate(view360.viewParam), view360Controller.remove);

router
  .route('/view360/:viewId/images')
  .get(validate(view360Image.viewParam), view360ImageController.listByView)
  .post(validate(view360Image.create), view360ImageController.createForView);

router
  .route('/view360-images/:imageId')
  .put(validate(view360Image.update), view360ImageController.update)
  .delete(validate(view360Image.imageParam), view360ImageController.remove);

/**
 * @swagger
 * /admin/travel-destinations:
 *   get:
 *     summary: Admin list travel destinations
 *     description: Supports pagination, search by name/description, category filter, and sort by created_at descending.
 *     tags: [Admin Travel Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: dinh
 *       - in: query
 *         name: destination_category_id
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Travel destination list with pagination
 *   post:
 *     summary: Admin create travel destination
 *     description: Creates a destination after validating admin role and duplicate name.
 *     tags: [Admin Travel Destinations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dinh Doc Lap
 *               description:
 *                 type: string
 *                 example: Historic landmark in Ho Chi Minh City
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/dinhdoclap.jpg
 *               destination_category_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: Travel destination created successfully
 *       409:
 *         description: Travel destination name already exists
 *
 * /admin/travel-destinations/{id}:
 *   get:
 *     summary: Admin get travel destination detail
 *     description: Includes locations, tours, view360, and statistics.
 *     tags: [Admin Travel Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Travel destination detail
 *   put:
 *     summary: Admin update travel destination
 *     description: Updates one or more travel destination fields. Fields not provided are kept unchanged.
 *     tags: [Admin Travel Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dinh Doc Lap Updated
 *               description:
 *                 type: string
 *                 example: Updated historic landmark description
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 example: https://example.com/dinhdoclap-updated.jpg
 *               destination_category_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       200:
 *         description: Updated successfully
 *   delete:
 *     summary: Admin delete travel destination
 *     description: Soft deletes the destination only when it has no tours or locations.
 *     tags: [Admin Travel Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       400:
 *         description: Cannot delete while tours or locations still exist
 *
 * /admin/destination-categories:
 *   get:
 *     summary: Admin list destination categories
 *     tags: [Admin Destination Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Destination category list
 *   post:
 *     summary: Admin create destination category
 *     tags: [Admin Destination Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Historical
 *               description:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Destination category created
 *
 * /admin/destination-categories/{id}:
 *   get:
 *     summary: Admin get destination category detail
 *     tags: [Admin Destination Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Destination category detail
 *   put:
 *     summary: Admin update destination category
 *     tags: [Admin Destination Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Historical Updated
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Updated destination category description
 *     responses:
 *       200:
 *         description: Destination category updated
 *   delete:
 *     summary: Admin delete destination category
 *     tags: [Admin Destination Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Destination category deleted
 *
 * /admin/tour-categories:
 *   get:
 *     summary: Admin list tour categories
 *     tags: [Admin Tour Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tour category list
 *   post:
 *     summary: Admin create tour category
 *     tags: [Admin Tour Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Family
 *               description:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Tour category created
 *
 * /admin/locations:
 *   get:
 *     summary: Admin list locations
 *     description: Admin can view all locations with pagination, search, destination filter, and sorting. Default sort is created_at DESC.
 *     tags: [Admin Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: dinh
 *       - in: query
 *         name: destination_id
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [location_id, name, created_at, updated_at]
 *           example: created_at
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: DESC
 *     responses:
 *       200:
 *         description: Location list with total records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       location_id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Main Gate
 *                       description:
 *                         type: string
 *                         example: Main entrance area
 *                       travel_destination_id:
 *                         type: integer
 *                         example: 1
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 20
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Admin create new location
 *     description: Creates a new location inside a TravelDestination. Duplicate location names inside the same destination are not allowed.
 *     tags: [Admin Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [travel_destination_id, name]
 *             properties:
 *               travel_destination_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 example: Main Gate
 *               description:
 *                 type: string
 *                 example: Main entrance of Dinh Doc Lap
 *               latitude:
 *                 type: number
 *                 nullable: true
 *                 example: 10.777
 *               longitude:
 *                 type: number
 *                 nullable: true
 *                 example: 106.695
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 example: https://example.com/main-gate.jpg
 *     responses:
 *       201:
 *         description: Location created successfully
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
 *                   example: Location created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     location_id:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Bad request
 *       404:
 *         description: Destination not found
 *       409:
 *         description: Duplicate location
 *
 * /admin/locations/{id}:
 *   put:
 *     summary: Admin update location
 *     description: Updates location information. Deleted locations cannot be updated and updated_at is changed automatically.
 *     tags: [Admin Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 example: Main Gate Updated
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Updated description
 *               latitude:
 *                 type: number
 *                 nullable: true
 *                 example: 10.777
 *               longitude:
 *                 type: number
 *                 nullable: true
 *                 example: 106.695
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 example: https://example.com/new-image.jpg
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Location not found
 *   delete:
 *     summary: Admin delete location
 *     description: Soft deletes a location only when it has no related View360, View360Image, Map, Review, or Blog_Location data.
 *     tags: [Admin Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *       404:
 *         description: Location not found
 *       409:
 *         description: Location has related data
 *
 * /admin/maps:
 *   get:
 *     summary: Admin list maps
 *     description: Admin can view all maps with pagination, location filter, and title search.
 *     tags: [Admin Maps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: Ground Floor
 *       - in: query
 *         name: location_id
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Map list with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       map_id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: Ground Floor Map
 *                       location_id:
 *                         type: integer
 *                         example: 5
 *                       location_name:
 *                         type: string
 *                         example: Main Building
 *                       map_file:
 *                         type: string
 *                         example: map.jpg
 *                       description:
 *                         type: string
 *                         nullable: true
 *                         example: Map of the ground floor
 *                       display_order:
 *                         type: integer
 *                         nullable: true
 *                         example: 1
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 *   post:
 *     summary: Admin create map
 *     description: Admin uploads and creates a map for an active location. Supports jpg, jpeg, png, webp, and svg files.
 *     tags: [Admin Maps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [location_id, title, map_file]
 *             properties:
 *               location_id:
 *                 type: integer
 *                 example: 5
 *               title:
 *                 type: string
 *                 example: Ground Floor Map
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Ground floor layout
 *               map_file:
 *                 type: string
 *                 format: binary
 *               display_order:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *         application/json:
 *           schema:
 *             type: object
 *             required: [location_id, title, map_file]
 *             properties:
 *               location_id:
 *                 type: integer
 *                 example: 5
 *               title:
 *                 type: string
 *                 example: Ground Floor Map
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Ground floor layout
 *               map_file:
 *                 type: string
 *                 example: /public/maps/ground-floor.png
 *               display_order:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: Map created successfully
 *       400:
 *         description: Validation error or unsupported file format
 *       404:
 *         description: Location not found
 *
 * /admin/maps/{id}:
 *   put:
 *     summary: Admin update map
 *     description: Admin updates map information. Location relationship cannot be changed.
 *     tags: [Admin Maps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               title:
 *                 type: string
 *                 example: Ground Floor Updated
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Updated layout
 *               map_file:
 *                 type: string
 *                 format: binary
 *               display_order:
 *                 type: integer
 *                 nullable: true
 *                 example: 2
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               title:
 *                 type: string
 *                 example: Ground Floor Updated
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Updated layout
 *               map_file:
 *                 type: string
 *                 example: /public/maps/ground-floor-updated.png
 *               display_order:
 *                 type: integer
 *                 nullable: true
 *                 example: 2
 *     responses:
 *       200:
 *         description: Map updated successfully
 *       400:
 *         description: Validation error or unsupported file format
 *       404:
 *         description: Map not found
 *   delete:
 *     summary: Admin delete map
 *     description: Soft deletes a map. The database record is kept for audit history and the uploaded file is not physically removed.
 *     tags: [Admin Maps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Map deleted successfully
 *       404:
 *         description: Map not found
 */
router.use('/users', require('./user.route'));
router.use('/travel-destinations', require('./travelDestination.route'));
router.use('/tours', require('./tour.route'));
router.use('/locations', require('./location.route'));
router.use('/blogs', require('./blog.route'));
router.use('/maps', require('./map.route'));
router.use('/destination-categories', require('./destinationCategory.route'));
router.use('/tour-categories', require('./tourCategory.route'));
router.use('/statistics', require('./statistics.route'));

module.exports = router;
