const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const statisticsController = require('../controllers/statistics.controller');
const view360Controller = require('../controllers/view360.controller');
const view360HotspotController = require('../controllers/view360Hotspot.controller');
const view360ImageController = require('../controllers/view360Image.controller');
const groupTripController = require('../controllers/groupTrip.controller');
const {
  handleView360AudioUpload,
  handleView360ImageUpload,
} = require('../middlewares/upload.middleware');
const { view360, view360Hotspot, view360Image, groupTrip } = require('../validators');

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
 *   - name: Admin Tours
 *     description: Admin tour viewing endpoints. Requires Bearer token with role `admin`.
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

/**
 * @swagger
 * /admin/group-trips:
 *   get:
 *     summary: Admin list all public/private and active/archived group trips
 *     tags: [Admin Group Trips]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Paginated group trip list }
 * /admin/group-trips/{id}:
 *   get:
 *     summary: Admin view any group trip
 *     tags: [Admin Group Trips]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Group trip detail and itinerary }
 *   patch:
 *     summary: Admin update any group trip
 *     description: Updates one or more group trip settings. Omitted fields remain unchanged.
 *     tags: [Admin Group Trips]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Group trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             additionalProperties: false
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 150
 *                 example: Mekong Delta Adventure
 *               description:
 *                 type: string
 *                 maxLength: 5000
 *                 nullable: true
 *                 example: Updated itinerary for the group trip
 *               destination_id:
 *                 type: integer
 *                 minimum: 1
 *                 nullable: true
 *                 description: Active travel destination ID; null removes the linked destination.
 *                 example: 12
 *               destination_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 200
 *                 nullable: true
 *                 description: Custom/fallback destination name.
 *                 example: Can Tho, Vietnam
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-10
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: Must be on or after start_date (including the currently stored start date).
 *                 example: 2026-08-13
 *               max_members:
 *                 type: integer
 *                 minimum: 2
 *                 maximum: 500
 *                 nullable: true
 *                 description: Cannot be lower than the current active member count; null removes the limit.
 *                 example: 20
 *               visibility:
 *                 type: string
 *                 enum: [public, private]
 *                 example: public
 *     responses:
 *       200: { description: Updated group trip detail and itinerary }
 *       400: { description: Invalid payload or date range }
 *       404: { description: Group trip or destination not found }
 *       409: { description: max_members is lower than the active member count }
 *   delete:
 *     summary: Admin soft-delete any group trip
 *     description: Marks the group trip as deleted by setting deleted_at. Related members, invitations, itinerary items, and the linked booking remain stored.
 *     tags: [Admin Group Trips]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Group trip marked as deleted }
 *       404: { description: Group trip not found }
 * /admin/group-trips/{id}/members:
 *   get:
 *     summary: Admin view members of any group trip
 *     tags: [Admin Group Trips]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Paginated active member list }
 */
router.get(
  '/group-trips',
  validate({ query: groupTrip.adminListQuery }),
  groupTripController.listAdmin
);
router.get(
  '/group-trips/:id',
  validate({ params: groupTrip.idParam }),
  groupTripController.getAdmin
);
router.patch(
  '/group-trips/:id',
  validate(groupTrip.updateSettings),
  groupTripController.updateAdmin
);
router.delete(
  '/group-trips/:id',
  validate({ params: groupTrip.idParam }),
  groupTripController.deleteAdmin
);
router.get(
  '/group-trips/:id/members',
  validate({ params: groupTrip.idParam, query: groupTrip.listQuery }),
  groupTripController.listMembersAdmin
);
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
 *           enum: [admin, staff, customer]
 *         example: customer
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
 *                         example: customer
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
 *     description: Admin creates a user and emails the password to the user. If password is omitted or blank, the backend generates a temporary password, hashes it before saving, and emails it.
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, email, role, status]
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 150
 *                 example: Nguyen Van A
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 nullable: true
 *                 description: Optional. If omitted or blank, a temporary password is generated and emailed to the user.
 *                 example: Temp123456
 *               role:
 *                 type: string
 *                 enum: [admin, staff, customer]
 *                 example: customer
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending]
 *                 example: active
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 example: "0901234567"
 *               avatar_file:
 *                 type: string
 *                 format: binary
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, role, status]
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
 *                 nullable: true
 *                 description: Optional. Must be at least 6 characters and not contain only spaces. If omitted or blank, a temporary password is generated and emailed to the user.
 *                 example: Temp123456
 *               role:
 *                 type: string
 *                 enum: [admin, staff, customer]
 *                 example: customer
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending]
 *                 example: active
 *               phone:
 *                 type: string
 *                 pattern: '^0(?:3|5|7|8|9)\\d{8}$'
 *                 nullable: true
 *                 example: "0901234567"
 *               avatar_url:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 example: https://example.com/avatar.jpg
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
 *     description: Admin updates one or more user fields and can upload a new avatar. If password is provided, the backend hashes it before saving.
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 150
 *                 example: Nguyen Van B
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user.updated@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: NewTemp123456
 *               role:
 *                 type: string
 *                 enum: [admin, staff, customer]
 *                 example: staff
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending]
 *                 example: active
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 example: "0907654321"
 *               avatar_file:
 *                 type: string
 *                 format: binary
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
 *                 enum: [admin, staff, customer]
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
 *               avatar_url:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 example: https://example.com/avatar-updated.jpg
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
 *   delete:
 *     summary: Admin delete user
 *     description: Deletes a non-admin user only when the account has no related service data such as bookings, active reviews, blogs, or created coupons. If deletion is blocked, the response includes details explaining why.
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
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Admin users cannot be deleted
 *       404:
 *         description: User not found
 *       409:
 *         description: User has related service data and cannot be deleted
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
 *         multipart/form-data:
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
 *                 format: binary
 *               language:
 *                 type: string
 *                 default: vi
 *                 example: vi
 *               order_index:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
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
 *         multipart/form-data:
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
 *                 format: binary
 *               language:
 *                 type: string
 *                 example: en
 *               order_index:
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image_file]
 *             properties:
 *               image_file:
 *                 type: string
 *                 format: binary
 *               order_index:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               image_file:
 *                 type: string
 *                 format: binary
 *               order_index:
 *                 type: integer
 *                 nullable: true
 *                 example: 2
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
 *
 * /admin/view360/{view360Id}/hotspots:
 *   get:
 *     summary: Admin list View360 hotspots
 *     tags: [Admin View360]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: view360Id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: View360 hotspot list
 *   post:
 *     summary: Admin create View360 hotspot
 *     tags: [Admin View360]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: view360Id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [yaw, pitch]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [info, navigation, link, location]
 *                 example: info
 *               title:
 *                 type: string
 *                 nullable: true
 *                 example: Cổng chính
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Khu vực lối vào chính
 *               yaw:
 *                 type: number
 *                 example: 120.5
 *               pitch:
 *                 type: number
 *                 example: -8.2
 *               target_view360_id:
 *                 type: integer
 *                 nullable: true
 *               target_url:
 *                 type: string
 *                 nullable: true
 *               order_index:
 *                 type: integer
 *                 example: 1
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: View360 hotspot created successfully
 *
 * /admin/view360-hotspots/{hotspotId}:
 *   put:
 *     summary: Admin update View360 hotspot
 *     tags: [Admin View360]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hotspotId
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
 *               type:
 *                 type: string
 *                 enum: [info, navigation, link, location]
 *               title:
 *                 type: string
 *                 nullable: true
 *               description:
 *                 type: string
 *                 nullable: true
 *               yaw:
 *                 type: number
 *               pitch:
 *                 type: number
 *               target_view360_id:
 *                 type: integer
 *                 nullable: true
 *               target_url:
 *                 type: string
 *                 nullable: true
 *               order_index:
 *                 type: integer
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: View360 hotspot updated successfully
 *   delete:
 *     summary: Admin delete View360 hotspot
 *     tags: [Admin View360]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hotspotId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: View360 hotspot deleted successfully
 */
router
  .route('/locations/:locationId/view360')
  .get(validate(view360.locationParam), view360Controller.listByLocation)
  .post(handleView360AudioUpload, validate(view360.create), view360Controller.createForLocation);

router
  .route('/view360/:viewId')
  .put(handleView360AudioUpload, validate(view360.update), view360Controller.update)
  .delete(validate(view360.viewParam), view360Controller.remove);

router
  .route('/view360/:viewId/images')
  .get(validate(view360Image.viewParam), view360ImageController.listByView)
  .post(handleView360ImageUpload, validate(view360Image.create), view360ImageController.createForView);

router
  .route('/view360-images/:imageId')
  .put(handleView360ImageUpload, validate(view360Image.update), view360ImageController.update)
  .delete(validate(view360Image.imageParam), view360ImageController.remove);

router
  .route('/view360/:view360Id/hotspots')
  .get(validate(view360Hotspot.viewParam), view360HotspotController.listByView)
  .post(validate(view360Hotspot.create), view360HotspotController.createForView);

router
  .route('/view360-hotspots/:hotspotId')
  .put(validate(view360Hotspot.update), view360HotspotController.update)
  .delete(validate(view360Hotspot.hotspotParam), view360HotspotController.remove);

/**
 * @swagger
 * /admin/tours:
 *   get:
 *     summary: Admin view tour list
 *     description: Admin can view all tours with pagination, tour-name search, destination/category/status filters, and sorting. Default sort is created_at DESC.
 *     tags: [Admin Tours]
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
 *       - in: query
 *         name: tour_category_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, draft, deleted]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [tour_id, name, price, capacity, status, created_at, updated_at]
 *           example: created_at
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: DESC
 *     responses:
 *       200:
 *         description: Tour list with pagination
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 *   post:
 *     summary: Admin create tour
 *     description: Creates a bookable tour under one tour category and one or more travel destinations. Supports uploading a thumbnail file. When using multipart/form-data, send destinations as a JSON string. Tour names must be unique.
 *     tags: [Admin Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [tour_category_id, name, price, child_price, schedule, capacity, destinations]
 *             properties:
 *               tour_category_id:
 *                 type: integer
 *                 example: 1
 *               content_items:
 *                 type: string
 *                 description: JSON array string of selected content items with display order.
 *                 example: '[{"id":8,"sort_order":1},{"id":3,"sort_order":2}]'
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 example: Dinh Doc Lap Half-day Tour
 *               slug:
 *                 type: string
 *                 description: Optional; generated uniquely from name when omitted.
 *                 example: dinh-doc-lap-half-day-tour
 *               short_description:
 *                 type: string
 *                 nullable: true
 *               duration_days: { type: integer, minimum: 0, default: 1 }
 *               duration_nights: { type: integer, minimum: 0, default: 0 }
 *               start_time: { type: string, example: '08:00' }
 *               end_time: { type: string, example: '17:00' }
 *               tour_type: { type: string, enum: [group, private, self_guided], default: group }
 *               languages:
 *                 type: string
 *                 description: JSON array string, for example `["vi","en"]`.
 *               difficulty: { type: string, enum: [easy, moderate, challenging, difficult], default: easy }
 *               minimum_participants: { type: integer, minimum: 1, default: 1 }
 *               minimum_booking: { type: integer, minimum: 1, default: 1 }
 *               maximum_booking: { type: integer, minimum: 1, nullable: true }
 *               meeting_point: { type: string, nullable: true }
 *               pickup_available: { type: boolean, default: false }
 *               pickup_description: { type: string, nullable: true }
 *               description:
 *                 type: string
 *                 format: html
 *                 nullable: true
 *                 description: Rich-text HTML content from the text editor.
 *                 example: <p>Explore Dinh Doc Lap with <strong>360 preview</strong> and tour guide.</p>
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 250000
 *               child_price:
 *                 type: number
 *                 minimum: 0
 *                 example: 162500
 *               infant_price: { type: number, minimum: 0, default: 0 }
 *               currency: { type: string, minLength: 3, maxLength: 3, default: VND }
 *               schedule:
 *                 type: string
 *                 example: 08:00 - 12:00
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 30
 *               thumbnail_file:
 *                 type: string
 *                 format: binary
 *               video_url: { type: string, format: uri, nullable: true }
 *               highlights: { type: string, description: 'JSON array string of highlight texts.' }
 *               inclusions: { type: string, description: 'JSON array string of included items.' }
 *               exclusions: { type: string, description: 'JSON array string of excluded items.' }
 *               requirements: { type: string, description: 'JSON array string of requirements.' }
 *               cancellation_policy: { type: string, nullable: true }
 *               booking_policy: { type: string, nullable: true }
 *               additional_information: { type: string, nullable: true }
 *               faqs:
 *                 type: string
 *                 description: 'JSON array string: [{"question":"...","answer":"...","order_index":1}]'
 *               gallery:
 *                 type: string
 *                 description: 'JSON array string: [{"type":"image","url":"https://...","alt":"...","order_index":1}]'
 *               status:
 *                 type: string
 *                 enum: [active, inactive, draft]
 *                 default: active
 *               destinations:
 *                 type: string
 *                 description: JSON array of tour destinations.
 *                 example: '[{"destination_id":1,"order_index":1,"day_number":1,"start_time":"08:00","end_time":"10:00","estimated_minutes":120,"activity":"Sightseeing","note":"Start point"}]'
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tour_category_id, name, price, child_price, schedule, capacity, destinations]
 *             properties:
 *               tour_category_id:
 *                 type: integer
 *                 example: 1
 *               content_items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [id, sort_order]
 *                   properties:
 *                     id: { type: integer }
 *                     sort_order: { type: integer, minimum: 1 }
 *                 description: Selected reusable items in display order. Explicit list content is normalized and deduplicated.
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 example: Dinh Doc Lap Half-day Tour
 *               slug: { type: string, example: dinh-doc-lap-half-day-tour }
 *               short_description: { type: string, nullable: true }
 *               duration_days: { type: integer, minimum: 0, default: 1 }
 *               duration_nights: { type: integer, minimum: 0, default: 0 }
 *               start_time: { type: string, example: '08:00' }
 *               end_time: { type: string, example: '17:00' }
 *               tour_type: { type: string, enum: [group, private, self_guided], default: group }
 *               languages:
 *                 type: array
 *                 items: { type: string }
 *                 example: [vi, en]
 *               difficulty: { type: string, enum: [easy, moderate, challenging, difficult], default: easy }
 *               minimum_participants: { type: integer, minimum: 1, default: 1 }
 *               minimum_booking: { type: integer, minimum: 1, default: 1 }
 *               maximum_booking: { type: integer, minimum: 1, nullable: true }
 *               meeting_point: { type: string, nullable: true }
 *               pickup_available: { type: boolean, default: false }
 *               pickup_description: { type: string, nullable: true }
 *               description:
 *                 type: string
 *                 format: html
 *                 nullable: true
 *                 description: Rich-text HTML content from the text editor.
 *                 example: <p>Explore Dinh Doc Lap with <strong>360 preview</strong> and tour guide.</p>
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 250000
 *               child_price:
 *                 type: number
 *                 minimum: 0
 *                 example: 162500
 *               infant_price: { type: number, minimum: 0, default: 0 }
 *               currency: { type: string, minLength: 3, maxLength: 3, default: VND }
 *               schedule:
 *                 type: string
 *                 example: 08:00 - 12:00
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 30
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 example: https://example.com/tour.jpg
 *               thumbnail_url: { type: string, format: uri, nullable: true, description: Alias of thumbnail. }
 *               video_url: { type: string, format: uri, nullable: true }
 *               highlights: { type: array, items: { type: string } }
 *               inclusions: { type: array, items: { type: string } }
 *               exclusions: { type: array, items: { type: string } }
 *               requirements: { type: array, items: { type: string } }
 *               cancellation_policy: { type: string, nullable: true }
 *               booking_policy: { type: string, nullable: true }
 *               additional_information: { type: string, nullable: true }
 *               faqs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [question, answer, order_index]
 *                   properties:
 *                     faq_id: { type: integer, description: Optional; assigned automatically when omitted. }
 *                     question: { type: string }
 *                     answer: { type: string }
 *                     order_index: { type: integer, minimum: 1 }
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [url, order_index]
 *                   properties:
 *                     media_id: { type: integer, description: Optional; assigned automatically when omitted. }
 *                     type: { type: string, enum: [image, video], default: image }
 *                     url: { type: string }
 *                     alt: { type: string, nullable: true }
 *                     order_index: { type: integer, minimum: 1 }
 *               status:
 *                 type: string
 *                 enum: [active, inactive, draft]
 *                 default: active
 *               destinations:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [destination_id, order_index]
 *                   properties:
 *                     destination_id:
 *                       type: integer
 *                       example: 1
 *                     order_index:
 *                       type: integer
 *                       minimum: 1
 *                       example: 1
 *                     estimated_time:
 *                       type: string
 *                       nullable: true
 *                       example: 90 minutes
 *                     estimated_minutes: { type: integer, minimum: 0, nullable: true, example: 90 }
 *                     day_number: { type: integer, minimum: 1, default: 1 }
 *                     start_time: { type: string, nullable: true, example: '08:00' }
 *                     end_time: { type: string, nullable: true, example: '09:30' }
 *                     activity: { type: string, nullable: true }
 *                     note:
 *                       type: string
 *                       nullable: true
 *                       example: Start point
 *     responses:
 *       201:
 *         description: Tour created successfully
 *       400:
 *         description: Bad Request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: TravelDestination Not Found or TourCategory Not Found
 *       409:
 *         description: Duplicate Tour
 *       500:
 *         description: Internal Server Error
 *
 * /admin/tours/{id}:
 *   get:
 *     summary: Admin view tour detail
 *     tags: [Admin Tours]
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
 *         description: Tour detail
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Tour not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *     summary: Admin update tour
 *     description: Updates tour fields and, when provided, replaces the tour destinations list inside a transaction. Supports uploading a new thumbnail file. When using multipart/form-data, send destinations as a JSON string.
 *     tags: [Admin Tours]
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
 *               tour_category_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 example: Saigon Full Day Tour Updated
 *               description:
 *                 type: string
 *                 format: html
 *                 nullable: true
 *                 description: Rich-text HTML content from the text editor.
 *                 example: <p>Updated tour description with <strong>rich text</strong>.</p>
 *               price:
 *                 type: number
 *                 minimum: 0
 *               schedule:
 *                 type: string
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *               thumbnail_file:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: string
 *                 enum: [active, inactive, draft]
 *               destinations:
 *                 type: string
 *                 description: JSON array of tour destinations.
 *                 example: '[{"destination_id":1,"order_index":1,"estimated_time":"120 minutes","note":"Updated start point"}]'
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               tour_category_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 example: Saigon Full Day Tour Updated
 *               description:
 *                 type: string
 *                 format: html
 *                 nullable: true
 *                 description: Rich-text HTML content from the text editor.
 *                 example: <p>Updated tour description with <strong>rich text</strong>.</p>
 *               price:
 *                 type: number
 *                 minimum: 0
 *               schedule:
 *                 type: string
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *               thumbnail:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *               status:
 *                 type: string
 *                 enum: [active, inactive, draft]
 *               destinations:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [destination_id, order_index]
 *                   properties:
 *                     destination_id:
 *                       type: integer
 *                     order_index:
 *                       type: integer
 *                       minimum: 1
 *                     estimated_time:
 *                       type: string
 *                       nullable: true
 *                     note:
 *                       type: string
 *                       nullable: true
 *     responses:
 *       200:
 *         description: Tour updated successfully
 *       400:
 *         description: Bad Request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Tour, TourCategory, or TravelDestination not found
 *       409:
 *         description: Duplicate Tour
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Admin delete tour
 *     description: Soft deletes a tour when it has no active bookings.
 *     tags: [Admin Tours]
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
 *         description: Tour deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Tour Not Found
 *       409:
 *         description: Tour Has Active Bookings
 *       500:
 *         description: Internal Server Error
 */
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
 *     description: Creates a destination after validating admin role and duplicate name. Supports uploading a thumbnail file or passing an existing thumbnail URL.
 *     tags: [Admin Travel Destinations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               thumbnail_file:
 *                 type: string
 *                 format: binary
 *               latitude:
 *                 type: number
 *                 nullable: true
 *                 example: 10.7769
 *               longitude:
 *                 type: number
 *                 nullable: true
 *                 example: 106.7009
 *               destination_category_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
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
 *               latitude:
 *                 type: number
 *                 nullable: true
 *                 example: 10.7769
 *               longitude:
 *                 type: number
 *                 nullable: true
 *                 example: 106.7009
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
 *     description: Updates one or more travel destination fields. Supports uploading a new thumbnail file or passing an existing thumbnail URL. Fields not provided are kept unchanged.
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
 *         multipart/form-data:
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
 *               thumbnail_file:
 *                 type: string
 *                 format: binary
 *               latitude:
 *                 type: number
 *                 nullable: true
 *                 example: 10.7769
 *               longitude:
 *                 type: number
 *                 nullable: true
 *                 example: 106.7009
 *               destination_category_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
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
 *               latitude:
 *                 type: number
 *                 nullable: true
 *                 example: 10.7769
 *               longitude:
 *                 type: number
 *                 nullable: true
 *                 example: 106.7009
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
 *                       map_count:
 *                         type: integer
 *                         description: Number of active maps belonging to this location
 *                         example: 2
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
 *     description: Creates a new location inside a TravelDestination. Supports uploading a thumbnail file or passing an existing thumbnail URL. Duplicate location names inside the same destination are not allowed.
 *     tags: [Admin Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               thumbnail_file:
 *                 type: string
 *                 format: binary
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
 *         description: Bad request or unsupported file format
 *       404:
 *         description: Destination not found
 *       409:
 *         description: Duplicate location
 *
 * /admin/locations/{id}:
 *   put:
 *     summary: Admin update location
 *     description: Updates location information, including moving it to another existing travel destination. Supports uploading a new thumbnail file or passing an existing thumbnail URL. Deleted locations cannot be updated and updated_at is changed automatically.
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               travel_destination_id:
 *                 type: integer
 *                 minimum: 1
 *                 example: 8
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
 *               thumbnail_file:
 *                 type: string
 *                 format: binary
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               travel_destination_id:
 *                 type: integer
 *                 minimum: 1
 *                 example: 8
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
 *         description: Bad request or unsupported file format
 *       404:
 *         description: Location or travel destination not found
 *       409:
 *         description: Duplicate location name inside the destination
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
 *                 example: https://s3.cloudfly.vn/travellens/maps/ground-floor.png
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
 *                 example: https://s3.cloudfly.vn/travellens/maps/ground-floor-updated.png
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
router.use('/tour-content-items', require('./tourContentItem.route'));
router.use('/locations', require('./location.route'));
router.use('/blogs', require('./blog.route'));
router.use('/media', require('./mediaFile.route'));
router.use('/maps', require('./map.route'));
router.use('/travel-feed', require('./travelPostAdmin.route'));
router.use('/destination-categories', require('./destinationCategory.route'));
router.use('/tour-categories', require('./tourCategory.route'));
router.use('/blog-categories', require('./blogCategory.route'));

module.exports = router;
