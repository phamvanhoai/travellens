const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const userController = require('../controllers/user.controller');
const { user } = require('../validators');

const router = express.Router();

router.use(authenticate, authorize('staff', 'admin'));

/**
 * @swagger
 * tags:
 *   - name: Staff Coupons
 *     description: Staff coupon management endpoints. Requires Bearer token with role `staff` or `admin`.
 *   - name: Staff Bookings
 *     description: Staff booking management endpoints. Requires Bearer token with role `staff` or `admin`.
 *   - name: Staff Reviews
 *     description: Staff review moderation endpoints. Requires Bearer token with role `staff` or `admin`.
 *   - name: Staff Payments
 *     description: Staff payment management endpoints. Requires Bearer token with role `staff` or `admin`.
 *   - name: Staff Customers
 *     description: Staff customer lookup endpoints. Requires Bearer token with role `staff` or `admin`.
 *
 * /staff/reviews:
 *   get:
 *     summary: View review list
 *     tags: [Staff Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Review list
 *
 * /staff/reviews/{id}:
 *   delete:
 *     summary: Delete review
 *     tags: [Staff Reviews]
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
 *         description: Review deleted
 *
 * /staff/coupons:
 *   get:
 *     summary: List coupons
 *     tags: [Staff Coupons]
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
 *           example: SUMMER
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, expired, archived]
 *       - in: query
 *         name: discount_type
 *         schema:
 *           type: string
 *           enum: [percentage, fixed]
 *     responses:
 *       200:
 *         description: Coupon list
 *   post:
 *     summary: Create coupon
 *     tags: [Staff Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, discount_type, discount_value, usage_limit, start_date, end_date]
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUMMER20
 *               name:
 *                 type: string
 *                 example: Summer Discount
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: 20% discount for summer tours
 *               discount_type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: percentage
 *               discount_value:
 *                 type: number
 *                 example: 20
 *               max_discount_amount:
 *                 type: number
 *                 nullable: true
 *                 example: 100000
 *               min_order_amount:
 *                 type: number
 *                 example: 500000
 *               usage_limit:
 *                 type: integer
 *                 example: 100
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-30"
 *               status:
 *                 type: string
 *                 enum: [active, inactive, expired]
 *                 example: active
 *     responses:
 *       201:
 *         description: Coupon created
 *       409:
 *         description: Duplicate coupon code
 *
 * /staff/coupons/{id}:
 *   get:
 *     summary: Get coupon detail
 *     tags: [Staff Coupons]
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
 *         description: Coupon detail
 *   put:
 *     summary: Update coupon
 *     tags: [Staff Coupons]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Summer Discount Updated
 *               description:
 *                 type: string
 *                 nullable: true
 *               discount_type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               discount_value:
 *                 type: number
 *                 example: 15
 *               max_discount_amount:
 *                 type: number
 *                 nullable: true
 *               min_order_amount:
 *                 type: number
 *               usage_limit:
 *                 type: integer
 *                 example: 150
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [active, inactive, expired]
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       404:
 *         description: Coupon not found
 *   delete:
 *     summary: Delete coupon
 *     tags: [Staff Coupons]
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
 *         description: Coupon deleted successfully
 *       409:
 *         description: Coupon has been used in bookings and cannot be deleted
 *       404:
 *         description: Coupon not found
 *
 * /staff/coupons/{id}/archive:
 *   patch:
 *     summary: Archive coupon
 *     description: Permanently retires a coupon while preserving its code and booking history. Archived coupons cannot be updated, deleted, applied, or reused.
 *     tags: [Staff Coupons]
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
 *         description: Coupon archived successfully
 *       404:
 *         description: Coupon not found
 *       409:
 *         description: Coupon is already archived
 *
 * /staff/bookings:
 *   get:
 *     summary: View booking tour
 *     tags: [Staff Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booking list
 *   post:
 *     summary: Create booking tour
 *     description: Staff must lookup the customer by email first using `GET /staff/customers/lookup`, then send the returned `user_id` in this request body. Customer must exist, have role `customer`, and status `active`.
 *     tags: [Staff Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StaffBookingInput'
 *           examples:
 *             createStaffBooking:
 *               summary: Create booking for an active customer
 *               value:
 *                 user_id: 12
 *                 tour_id: 3
 *                 contact_phone: "0901234567"
 *                 travel_date: "2026-07-20"
 *                 coupon_code: null
 *                 passengers:
 *                   - passenger_name: Nguyen Van A
 *                     age_category: adult
 *                     seat_number: ""
 *                     special_request: ""
 *     responses:
 *       201:
 *         description: Booking created. Response includes customer fields for staff confirmation.
 *       400:
 *         description: Customer is required, customer is inactive/not found, tour unavailable, or request data is invalid.
 *       404:
 *         description: Tour not found.
 *
 * /staff/customers/lookup:
 *   get:
 *     summary: Lookup customer by email before staff creates a booking
 *     description: Email is the only customer identifier for staff booking creation. Phone and name can be duplicated and are returned only for confirmation. If the customer is inactive or the email belongs to a non-customer account, booking creation should be blocked.
 *     tags: [Staff Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         example: customer@example.com
 *     responses:
 *       200:
 *         description: Lookup result. `exists=true` means FE may use `customer.user_id` for `POST /staff/bookings`; otherwise FE should show the returned message and block booking creation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Success }
 *                 data:
 *                   $ref: '#/components/schemas/StaffCustomerLookupResult'
 *             examples:
 *               activeCustomer:
 *                 summary: Active customer found
 *                 value:
 *                   success: true
 *                   message: Success
 *                   data:
 *                     exists: true
 *                     customer:
 *                       user_id: 12
 *                       name: Nguyen Van A
 *                       email: customer@example.com
 *                       phone: "0901234567"
 *               notFound:
 *                 summary: Email does not exist
 *                 value:
 *                   success: true
 *                   message: Success
 *                   data:
 *                     exists: false
 *                     reason: not_found
 *                     message: Customer chưa tồn tại, vui lòng tạo tài khoản customer trước
 *               inactive:
 *                 summary: Customer is not active
 *                 value:
 *                   success: true
 *                   message: Success
 *                   data:
 *                     exists: false
 *                     reason: inactive
 *                     message: Customer đang không hoạt động, vui lòng kích hoạt tài khoản trước khi tạo booking
 *                     customer:
 *                       user_id: 12
 *                       name: Nguyen Van A
 *                       email: customer@example.com
 *                       phone: "0901234567"
 *                       status: inactive
 *               notCustomer:
 *                 summary: Email belongs to staff/admin
 *                 value:
 *                   success: true
 *                   message: Success
 *                   data:
 *                     exists: false
 *                     reason: not_customer
 *                     message: Email này không thuộc tài khoản customer
 *                     customer:
 *                       user_id: 2
 *                       name: Staff User
 *                       email: staff@example.com
 *                       phone: "0901234567"
 *                       status: active
 *       400:
 *         description: Missing or invalid email.
 */
router.get('/customers/lookup', validate(user.customerLookup), userController.lookupCustomerForStaff);

router.use('/reviews', require('./review.route'));
router.use('/coupons', require('./coupon.route'));
router.use('/bookings', require('./bookingStaff.route'));
router.use('/booking-details', require('./bookingDetail.route'));
router.use('/payments', require('./paymentStaff.route'));
router.use('/refund-requests', require('./refundRequestStaff.route'));

module.exports = router;
