const swaggerJsdoc = require('swagger-jsdoc');

// Keep documentation-only route annotations in Vercel's serverless bundle.
require('../routes/apiDocs.route');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Travel360 API',
      version: '1.0.0',
      description: 'Backend API for travel booking, 360 views, maps, blogs, reviews, statistics, and AI suggestions.',
    },
    tags: [
      { name: 'Auth', description: 'Authentication and profile endpoints' },
      { name: 'Admin Users', description: 'Admin user management' },
      { name: 'Admin Statistics', description: 'Admin dashboard and reporting endpoints' },
      { name: 'Admin Travel Destinations', description: 'Admin travel destination management' },
      { name: 'Admin Locations', description: 'Admin location management' },
      { name: 'Admin Maps', description: 'Admin map management' },
      { name: 'Locations', description: 'Public read-only location endpoints' },
      { name: 'Navigation', description: 'Customer route navigation endpoints' },
      { name: 'Admin View360', description: 'Admin 360 virtual scene and image management' },
      { name: 'Admin Destination Categories', description: 'Admin destination category management' },
      { name: 'Admin Tour Categories', description: 'Admin tour category management' },
      { name: 'Admin Tours', description: 'Admin tour viewing endpoints' },
      { name: 'Admin Blogs', description: 'Admin blog management endpoints' },
      { name: 'Admin Media', description: 'Admin reusable image library for blog content' },
      { name: 'Staff Coupons', description: 'Staff coupon management endpoints' },
      { name: 'Staff Bookings', description: 'Staff booking management endpoints' },
      { name: 'Staff Reviews', description: 'Staff review moderation endpoints' },
      { name: 'Staff Payments', description: 'Staff payment management endpoints' },
      { name: 'Staff Refund Requests', description: 'Staff manual refund request endpoints' },
      { name: 'Payments', description: 'Customer payment endpoints' },
      { name: 'Webhooks', description: 'External provider webhook endpoints' },
      { name: 'Health', description: 'API health check' },
      { name: 'Tours', description: 'Tour endpoints' },
      { name: 'Travel Destinations', description: 'Travel destination endpoints' },
      { name: 'Maps', description: 'Map endpoints' },
      { name: 'Bookings', description: 'Customer booking endpoints. Requires Bearer token with role customer.' },
      { name: 'Blogs', description: 'Travel blog endpoints' },
      { name: 'Reviews', description: 'Location review endpoints' },
      { name: 'AI Chat', description: 'AI travel chat endpoints' },
      { name: 'AI Suggestions', description: 'AI travel suggestion endpoints' },
      { name: 'View360', description: 'Virtual tour scene endpoints' },
      { name: 'View360 Images', description: 'Virtual tour image endpoints' },
      { name: 'DestinationCategories', description: 'Public destination category endpoints' },
      { name: 'TourCategories', description: 'Public tour category endpoints' },
      { name: 'Coupons', description: 'Coupon endpoints' },
    ],
    servers: [
      {
        url: '/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        sepayApiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Enter the full SePay API key header value, for example: Apikey 1234567890',
        },
      },
      schemas: {
        CategoryInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Historical' },
            description: { type: 'string', nullable: true },
          },
        },
        BookingInput: {
          type: 'object',
          required: ['tour_id', 'departure_at'],
          properties: {
            user_id: { type: 'integer', readOnly: true, description: 'Resolved from the authenticated customer token.' },
            tour_id: { type: 'integer', example: 1 },
            departure_at: { type: 'string', format: 'date-time', example: '2026-07-15T08:00:00+07:00' },
            coupon_code: { type: 'string', nullable: true, example: 'SUMMER20' },
            passengers: {
              type: 'array',
              items: {
                type: 'object',
                required: ['passenger_name', 'age_category', 'price'],
                properties: {
                  passenger_name: { type: 'string', example: 'Nguyen Van A' },
                  age_category: { type: 'string', enum: ['adult', 'child', 'infant'] },
                  price: { type: 'number', example: 700000 },
                  seat_number: { type: 'string', nullable: true },
                  special_request: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        BookingDetailInput: {
          type: 'object',
          required: ['booking_id', 'passenger_name', 'age_category', 'price'],
          properties: {
            booking_id: { type: 'integer', example: 1 },
            passenger_name: { type: 'string', example: 'Nguyen Van A' },
            age_category: { type: 'string', enum: ['adult', 'child', 'infant'] },
            price: { type: 'number', example: 700000 },
            seat_number: { type: 'string', nullable: true },
            special_request: { type: 'string', nullable: true },
          },
        },
        BlogInput: {
          type: 'object',
          required: ['user_id', 'title'],
          properties: {
            user_id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'A day at Dinh Doc Lap' },
            content: { type: 'string', nullable: true },
            location_ids: { type: 'array', items: { type: 'integer' }, example: [1] },
          },
        },
        ReviewInput: {
          type: 'object',
          required: ['user_id', 'location_id', 'rating'],
          properties: {
            user_id: { type: 'integer', example: 1 },
            location_id: { type: 'integer', example: 1 },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            comment: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
          },
        },
        GenericInput: {
          type: 'object',
          additionalProperties: true,
        },
        CustomerPayment: {
          type: 'object',
          properties: {
            payment_id: { type: 'integer', example: 1 },
            booking_id: { type: 'integer', example: 123 },
            payment_code: { type: 'string', example: 'TVL000123ABCD' },
            amount: { type: 'number', example: 700000 },
            currency: { type: 'string', example: 'VND' },
            status: { type: 'string', enum: ['pending', 'paid', 'failed', 'expired', 'refunded'] },
            bank_account: { type: 'string', nullable: true, example: '123456789' },
            bank_name: { type: 'string', nullable: true, example: 'MBBank' },
            transfer_content: { type: 'string', example: 'TVL000123ABCD' },
            qr_url: {
              type: 'string',
              format: 'uri',
              nullable: true,
              example: 'https://qr.sepay.vn/img?acc=123456789&bank=MBBank&amount=700000&des=TVL000123ABCD',
            },
            expired_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const removeOperations = (path, operations) => {
  if (!swaggerSpec.paths[path]) return;

  for (const operation of operations) {
    delete swaggerSpec.paths[path][operation];
  }

  if (!Object.keys(swaggerSpec.paths[path]).length) {
    delete swaggerSpec.paths[path];
  }
};

const publicReadOnlyResources = [
  '/destination-categories',
  '/destination-categories/{id}',
  '/tour-categories',
  '/tour-categories/{id}',
  '/tours',
  '/tours/{id}',
  '/travel-destinations',
  '/travel-destinations/{id}',
  '/view360',
  '/view360/{id}',
  '/view360-images',
  '/view360-images/{id}',
  '/maps',
  '/maps/{id}',
  '/reviews',
  '/reviews/{id}',
];

for (const path of publicReadOnlyResources) {
  removeOperations(path, ['post', 'put', 'patch', 'delete']);
}

delete swaggerSpec.paths['/booking-details'];
delete swaggerSpec.paths['/booking-details/{id}'];
delete swaggerSpec.paths['/blog-locations'];
delete swaggerSpec.paths['/blog-locations/{id}'];
delete swaggerSpec.paths['/staff/reviews/{reviewId}/photos'];

module.exports = swaggerSpec;
