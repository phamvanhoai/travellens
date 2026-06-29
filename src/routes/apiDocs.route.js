const express = require('express');

// Documentation-only router. Swagger scans this file; application routes are
// registered in index.js, admin.route.js, and staff.route.js.
const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *
 * /admin/users/{id}:
 *   get:
 *     summary: Admin get user detail
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: User detail }
 *       404: { description: User not found }
 *   delete:
 *     summary: Admin delete user
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: User deleted }
 *
 * /admin/locations/{id}:
 *   get:
 *     summary: Admin get location detail
 *     tags: [Admin Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Location detail }
 *       404: { description: Location not found }
 *
 * /admin/maps/{id}:
 *   get:
 *     summary: Admin get map detail
 *     tags: [Admin Maps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Map detail }
 *       404: { description: Map not found }
 *
 * /admin/tour-categories/{id}:
 *   get:
 *     summary: Admin get tour category detail
 *     tags: [Admin Tour Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Tour category detail }
 *   put:
 *     summary: Admin update tour category
 *     tags: [Admin Tour Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CategoryInput' }
 *     responses:
 *       200: { description: Tour category updated }
 *   delete:
 *     summary: Admin delete tour category
 *     tags: [Admin Tour Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Tour category deleted }
 */

/**
 * @swagger
 * /admin/blogs:
 *   get:
 *     summary: Admin list blogs
 *     tags: [Admin Blogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Blog list }
 *   post:
 *     summary: Admin create blog
 *     tags: [Admin Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BlogInput' }
 *     responses:
 *       201: { description: Blog created }
 *
 * /admin/blogs/{id}:
 *   get:
 *     summary: Admin get blog detail
 *     tags: [Admin Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Blog detail }
 *   put:
 *     summary: Admin update blog
 *     tags: [Admin Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BlogInput' }
 *     responses:
 *       200: { description: Blog updated }
 *   delete:
 *     summary: Admin delete blog
 *     tags: [Admin Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Blog deleted }
 */

/**
 * @swagger
 * /staff/bookings/{id}:
 *   get:
 *     summary: Staff get booking detail
 *     tags: [Staff Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Booking detail }
 *   put:
 *     summary: Staff update booking
 *     tags: [Staff Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GenericInput' }
 *     responses:
 *       200: { description: Booking updated }
 *   delete:
 *     summary: Staff delete booking
 *     tags: [Staff Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Booking deleted }
 *
 * /staff/bookings/{id}/cancel:
 *   patch:
 *     summary: Staff cancel booking
 *     description: Cancels an unpaid booking. Pending payment records are expired. Paid bookings must be refunded through the staff payment refund flow.
 *     tags: [Staff Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 maxLength: 1000
 *                 nullable: true
 *                 example: Customer requested cancellation
 *     responses:
 *       200: { description: Booking canceled }
 *       400: { description: Booking is already canceled or expired }
 *       404: { description: Booking not found }
 *       409: { description: Paid booking requires staff refund before cancellation }
 *
 * /staff/bookings/{id}/history:
 *   get:
 *     summary: Staff get booking status history
 *     tags: [Staff Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Booking status history }
 *       404: { description: Booking not found }
 *
 * /staff/refund-requests:
 *   get:
 *     summary: Staff list manual refund requests
 *     tags: [Staff Refund Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, completed] }
 *       - in: query
 *         name: booking_id
 *         schema: { type: integer }
 *       - in: query
 *         name: payment_id
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Refund request list }
 *
 * /staff/refund-requests/{id}/complete:
 *   patch:
 *     summary: Staff mark manual refund as completed
 *     description: Staff calls this after transferring money manually. The payment is then marked refunded and booking payment_status becomes refunded.
 *     tags: [Staff Refund Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transaction_code:
 *                 type: string
 *                 nullable: true
 *               staff_note:
 *                 type: string
 *                 maxLength: 1000
 *                 nullable: true
 *     responses:
 *       200: { description: Refund completed }
 *       400: { description: Refund request is not pending or payment is not paid }
 *       404: { description: Refund request not found }
 *
 * /staff/reviews:
 *   post:
 *     summary: Staff create review
 *     tags: [Staff Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ReviewInput' }
 *     responses:
 *       201: { description: Review created }
 *
 * /staff/reviews/{id}:
 *   get:
 *     summary: Staff get review detail
 *     tags: [Staff Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Review detail }
 *   put:
 *     summary: Staff update review
 *     tags: [Staff Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ReviewInput' }
 *     responses:
 *       200: { description: Review updated }
 */

/**
 * @swagger
 * /staff/payments:
 *   get:
 *     summary: Staff list payments
 *     tags: [Staff Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, paid, failed, expired, refunded] }
 *       - in: query
 *         name: booking_id
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Payment list }
 *
 * /staff/payments/{id}:
 *   get:
 *     summary: Staff get payment detail
 *     tags: [Staff Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Payment detail }
 *
 * /staff/payments/{id}/refund:
 *   patch:
 *     summary: Staff refund payment
 *     tags: [Staff Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount: { type: number, example: 700000 }
 *               transaction_code: { type: string, nullable: true }
 *     responses:
 *       200: { description: Payment refunded }
 *
 * /staff/payments/{id}/status:
 *   patch:
 *     summary: Staff update payment status
 *     tags: [Staff Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [pending, paid, failed, expired, refunded] }
 *     responses:
 *       200: { description: Payment status updated }
 */

/**
 * @swagger
 * /destination-categories/{id}:
 *   get:
 *     summary: Get destination category detail
 *     tags: [DestinationCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Destination category detail }
 *   put:
 *     summary: Update destination category
 *     tags: [DestinationCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CategoryInput' }
 *     responses:
 *       200: { description: Destination category updated }
 *   delete:
 *     summary: Delete destination category
 *     tags: [DestinationCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Destination category deleted }
 *
 * /tour-categories/{id}:
 *   get:
 *     summary: Get tour category detail
 *     tags: [TourCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Tour category detail }
 *   put:
 *     summary: Update tour category
 *     tags: [TourCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CategoryInput' }
 *     responses:
 *       200: { description: Tour category updated }
 *   delete:
 *     summary: Delete tour category
 *     tags: [TourCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Tour category deleted }
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: List bookings
 *     description: Customer can list only their own bookings.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Booking list }
 *   post:
 *     summary: Create booking
 *     description: Customer creates a booking for themselves. user_id is resolved from the JWT token.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BookingInput' }
 *     responses:
 *       201: { description: Booking created }
 *       400: { description: Tour is not available for booking or request data is invalid }
 *       401: { description: Authentication required }
 *       403: { description: Customer role required }
 *       404: { description: Tour not found }
 *
 * /bookings/{id}:
 *   get:
 *     summary: Get booking detail
 *     description: Customer can view only their own booking.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Booking detail }
 *
 * /bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel booking
 *     description: Customer can cancel their own booking at least 24 hours before the booking departure time. Pending payment records are expired. Paid bookings create a pending 100% manual refund request and then cancel the booking.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 maxLength: 1000
 *                 nullable: true
 *                 example: I changed my travel plan
 *     responses:
 *       200: { description: Booking canceled }
 *       400: { description: Booking is already canceled or expired }
 *       404: { description: Booking not found }
 *       409: { description: Paid payment record could not create a manual refund request }
 */

/**
 * @swagger
 * /booking-details:
 *   get:
 *     summary: List booking details
 *     tags: [Booking Details]
 *     responses:
 *       200: { description: Booking detail list }
 *   post:
 *     summary: Create booking detail
 *     tags: [Booking Details]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BookingDetailInput' }
 *     responses:
 *       201: { description: Booking detail created }
 *
 * /booking-details/{id}:
 *   get:
 *     summary: Get booking detail record
 *     tags: [Booking Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Booking detail record }
 *   put:
 *     summary: Update booking detail
 *     tags: [Booking Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BookingDetailInput' }
 *     responses:
 *       200: { description: Booking detail updated }
 *   delete:
 *     summary: Delete booking detail
 *     tags: [Booking Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Booking detail deleted }
 */

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: List blogs
 *     tags: [Blogs]
 *     responses:
 *       200: { description: Blog list }
 *   post:
 *     summary: Create blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BlogInput' }
 *     responses:
 *       201: { description: Blog created }
 *
 * /blogs/{id}:
 *   get:
 *     summary: Get blog detail
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Blog detail }
 *   put:
 *     summary: Update blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BlogInput' }
 *     responses:
 *       200: { description: Blog updated }
 *   delete:
 *     summary: Delete blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Blog deleted }
 */

/**
 * @swagger
 * /blog-locations:
 *   get:
 *     summary: List blog-location relationships
 *     tags: [Blog Locations]
 *     responses:
 *       200: { description: Blog-location list }
 *   post:
 *     summary: Create blog-location relationship
 *     tags: [Blog Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [blog_id, location_id]
 *             properties:
 *               blog_id: { type: integer, example: 1 }
 *               location_id: { type: integer, example: 1 }
 *     responses:
 *       201: { description: Blog-location relationship created }
 *
 * /blog-locations/{id}:
 *   get:
 *     summary: Get blog-location relationship
 *     tags: [Blog Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Blog-location relationship }
 *   put:
 *     summary: Update blog-location relationship
 *     tags: [Blog Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GenericInput' }
 *     responses:
 *       200: { description: Blog-location relationship updated }
 *   delete:
 *     summary: Delete blog-location relationship
 *     tags: [Blog Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Blog-location relationship deleted }
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: List reviews
 *     tags: [Reviews]
 *     responses:
 *       200: { description: Review list }
 *   post:
 *     summary: Create review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ReviewInput' }
 *     responses:
 *       201: { description: Review created }
 *
 * /reviews/{id}:
 *   get:
 *     summary: Get review detail
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Review detail }
 *   put:
 *     summary: Update review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ReviewInput' }
 *     responses:
 *       200: { description: Review updated }
 *   delete:
 *     summary: Delete review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Review deleted }
 */

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Ask AI travel assistant
 *     tags: [AI Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message: { type: string, example: Suggest a historical destination }
 *     responses:
 *       200: { description: AI reply }
 *
 * /suggestions:
 *   post:
 *     summary: Get AI travel suggestions
 *     tags: [AI Suggestions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GenericInput' }
 *     responses:
 *       200: { description: Travel suggestions }
 */

/**
 * @swagger
 * /tours:
 *   get:
 *     summary: List tours
 *     tags: [Tours]
 *     responses:
 *       200: { description: Tour list }
 *   post:
 *     summary: Create tour
 *     tags: [Tours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GenericInput' }
 *     responses:
 *       201: { description: Tour created }
 * /tours/{id}:
 *   get:
 *     summary: Get tour detail
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Tour detail }
 *   put:
 *     summary: Update tour
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GenericInput' }
 *     responses:
 *       200: { description: Tour updated }
 *   delete:
 *     summary: Delete tour
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Tour deleted }
 *
 * /travel-destinations:
 *   get:
 *     summary: List travel destinations
 *     tags: [Travel Destinations]
 *     responses:
 *       200: { description: Travel destination list }
 *   post:
 *     summary: Create travel destination
 *     tags: [Travel Destinations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GenericInput' }
 *     responses:
 *       201: { description: Travel destination created }
 * /travel-destinations/{id}:
 *   get:
 *     summary: Get travel destination detail
 *     tags: [Travel Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Travel destination detail }
 *   put:
 *     summary: Update travel destination
 *     tags: [Travel Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GenericInput' }
 *     responses:
 *       200: { description: Travel destination updated }
 *   delete:
 *     summary: Delete travel destination
 *     tags: [Travel Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Travel destination deleted }
 */

/**
 * @swagger
 * /view360:
 *   get:
 *     summary: List View360 scenes
 *     tags: [View360]
 *     responses:
 *       200: { description: View360 scene list }
 *   post:
 *     summary: Create View360 scene
 *     tags: [View360]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GenericInput' }
 *     responses:
 *       201: { description: View360 scene created }
 * /view360/{id}:
 *   get:
 *     summary: Get View360 scene
 *     tags: [View360]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: View360 scene }
 *   put:
 *     summary: Update View360 scene
 *     tags: [View360]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GenericInput' }
 *     responses:
 *       200: { description: View360 scene updated }
 *   delete:
 *     summary: Delete View360 scene
 *     tags: [View360]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: View360 scene deleted }
 *
 * /view360-images:
 *   get:
 *     summary: List View360 images
 *     tags: [View360 Images]
 *     responses:
 *       200: { description: View360 image list }
 *   post:
 *     summary: Create View360 image
 *     tags: [View360 Images]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GenericInput' }
 *     responses:
 *       201: { description: View360 image created }
 * /view360-images/{id}:
 *   get:
 *     summary: Get View360 image
 *     tags: [View360 Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: View360 image }
 *   put:
 *     summary: Update View360 image
 *     tags: [View360 Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GenericInput' }
 *     responses:
 *       200: { description: View360 image updated }
 *   delete:
 *     summary: Delete View360 image
 *     tags: [View360 Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: View360 image deleted }
 */

/**
 * @swagger
 * /maps:
 *   get:
 *     summary: List maps
 *     tags: [Maps]
 *     responses:
 *       200: { description: Map list }
 *   post:
 *     summary: Create map
 *     tags: [Maps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GenericInput' }
 *     responses:
 *       201: { description: Map created }
 * /maps/{id}:
 *   get:
 *     summary: Get map detail
 *     tags: [Maps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Map detail }
 *   put:
 *     summary: Update map
 *     tags: [Maps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GenericInput' }
 *     responses:
 *       200: { description: Map updated }
 *   delete:
 *     summary: Delete map
 *     tags: [Maps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Map deleted }
 */

/**
 * @swagger
 * /staff/booking-details:
 *   get:
 *     summary: Staff list booking details
 *     tags: [Staff Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Booking detail list }
 *   post:
 *     summary: Staff create booking detail
 *     tags: [Staff Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BookingDetailInput' }
 *     responses:
 *       201: { description: Booking detail created }
 * /staff/booking-details/{id}:
 *   get:
 *     summary: Staff get booking detail record
 *     tags: [Staff Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Booking detail record }
 *   put:
 *     summary: Staff update booking detail record
 *     tags: [Staff Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BookingDetailInput' }
 *     responses:
 *       200: { description: Booking detail updated }
 *   delete:
 *     summary: Staff delete booking detail record
 *     tags: [Staff Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Booking detail deleted }
 *
 * /staff/reviews/{reviewId}/photos:
 *   post:
 *     summary: Staff upload photos for a review
 *     tags: [Staff Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [photos]
 *             properties:
 *               photos:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       201: { description: Review photos uploaded }
 */

/**
 * @swagger
 * /admin/maps/travel:
 *   get:
 *     summary: Admin get interactive travel map data
 *     tags: [Admin Maps]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Map markers }
 * /admin/maps/filter:
 *   get:
 *     summary: Admin filter map markers
 *     tags: [Admin Maps]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Filtered markers }
 * /admin/maps/nearby:
 *   get:
 *     summary: Admin get nearby suggestions
 *     tags: [Admin Maps]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Nearby suggestions }
 */

module.exports = router;
