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
      { name: 'Admin Blog Categories', description: 'Admin blog category management endpoints' },
      { name: 'Admin Media', description: 'Admin reusable image library for blog content' },
      { name: 'Staff Coupons', description: 'Staff coupon management endpoints' },
      { name: 'Staff Bookings', description: 'Staff booking management endpoints' },
      { name: 'Staff Customers', description: 'Staff customer lookup endpoints' },
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
      { name: 'Group Trips', description: 'Customer group trip membership, leader, settings, and email invitation endpoints.' },
      { name: 'Blogs', description: 'Travel blog endpoints' },
      { name: 'Blog Categories', description: 'Public blog category endpoints' },
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
          required: ['tour_id', 'contact_phone', 'travel_date', 'passengers'],
          properties: {
            user_id: { type: 'integer', readOnly: true, description: 'Resolved from the authenticated customer token.' },
            tour_id: { type: 'integer', example: 1 },
            contact_phone: {
              type: 'string',
              pattern: '^0(?:3|5|7|8|9)\\d{8}$',
              example: '0901234567',
              description: 'Required Vietnamese mobile contact phone. Backend stores it in the first passenger special_request.',
            },
            travel_date: { type: 'string', format: 'date', example: '2026-07-15' },
            departure_at: { type: 'string', format: 'date-time', nullable: true, description: 'Optional override. If omitted, backend combines travel_date with the start time from tour.schedule.', example: '2026-07-15T08:00:00+07:00' },
            coupon_code: { type: 'string', nullable: true, example: 'SUMMER20' },
            passengers: {
              type: 'array',
              items: {
                type: 'object',
                required: ['passenger_name', 'age_category'],
                properties: {
                  passenger_name: {
                    type: 'string',
                    maxLength: 150,
                    pattern: '^[\\p{L}]+(?:\\s+[\\p{L}]+)+$',
                    example: 'Nguyen Van A',
                    description: 'At least 2 words, letters and spaces only.',
                  },
                  age_category: { type: 'string', enum: ['adult', 'child', 'infant'] },
                  seat_number: { type: 'string', nullable: true },
                  special_request: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        StaffBookingInput: {
          type: 'object',
          required: ['user_id', 'tour_id', 'contact_phone', 'travel_date', 'passengers'],
          properties: {
            user_id: {
              type: 'integer',
              example: 12,
              description: 'Customer user_id returned by GET /staff/customers/lookup. Staff must lookup by email first.',
            },
            tour_id: { type: 'integer', example: 1 },
            contact_phone: {
              type: 'string',
              pattern: '^0(?:3|5|7|8|9)\\d{8}$',
              example: '0901234567',
              description: 'Required phone of the actual contact/traveler when staff books on behalf of another person. Backend stores it in the first passenger special_request.',
            },
            travel_date: { type: 'string', format: 'date', example: '2026-07-15' },
            departure_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Optional override. If omitted, backend combines travel_date with the start time from tour.schedule.',
              example: '2026-07-15T08:00:00+07:00',
            },
            coupon_code: { type: 'string', nullable: true, example: 'SUMMER20' },
            passengers: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                required: ['passenger_name', 'age_category'],
                properties: {
                  passenger_name: {
                    type: 'string',
                    maxLength: 150,
                    pattern: '^[\\p{L}]+(?:\\s+[\\p{L}]+)+$',
                    example: 'Nguyen Van A',
                    description: 'At least 2 words, letters and spaces only.',
                  },
                  age_category: { type: 'string', enum: ['adult', 'child', 'infant'], example: 'adult' },
                  seat_number: { type: 'string', nullable: true, example: '' },
                  special_request: { type: 'string', nullable: true, example: '' },
                },
              },
            },
          },
        },
        StaffCustomerLookupResult: {
          type: 'object',
          properties: {
            exists: { type: 'boolean', example: true },
            reason: {
              type: 'string',
              nullable: true,
              enum: ['not_found', 'not_customer', 'inactive'],
              example: null,
            },
            message: {
              type: 'string',
              nullable: true,
              example: 'Customer chưa tồn tại, vui lòng tạo tài khoản customer trước',
            },
            customer: {
              type: 'object',
              nullable: true,
              properties: {
                user_id: { type: 'integer', example: 12 },
                name: { type: 'string', example: 'Nguyen Van A' },
                email: { type: 'string', format: 'email', example: 'customer@example.com' },
                phone: { type: 'string', nullable: true, example: '0901234567' },
                status: { type: 'string', nullable: true, example: 'active' },
              },
            },
          },
        },
        BookingDetailInput: {
          type: 'object',
          required: ['booking_id', 'passenger_name', 'age_category', 'price'],
          properties: {
            booking_id: { type: 'integer', example: 1 },
            passenger_name: {
              type: 'string',
              maxLength: 150,
              pattern: '^[\\p{L}]+(?:\\s+[\\p{L}]+)+$',
              example: 'Nguyen Van A',
              description: 'At least 2 words, letters and spaces only.',
            },
            age_category: { type: 'string', enum: ['adult', 'child', 'infant'] },
            price: { type: 'number', example: 700000 },
            seat_number: { type: 'string', nullable: true },
            special_request: { type: 'string', nullable: true },
          },
        },
        BlogInput: {
          type: 'object',
          required: ['title'],
          properties: {
            category_ids: { type: 'array', items: { type: 'integer' }, example: [1, 2] },
            title: { type: 'string', example: 'A day at Dinh Doc Lap' },
            slug: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', example: 'mot-ngay-tai-dinh-doc-lap', description: 'Optional custom URL slug. Generated from title when omitted.' },
            thumbnail: { type: 'string', format: 'uri', nullable: true, example: 'https://example.com/blog-thumbnail.jpg' },
            content: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['draft', 'published', 'archived'], default: 'published' },
            published_at: { type: 'string', format: 'date-time', nullable: true, description: 'Future values schedule public visibility.' },
            location_ids: { type: 'array', items: { type: 'integer' }, example: [1] },
          },
        },
        BlogUpdateInput: {
          type: 'object',
          minProperties: 1,
          properties: {
            category_ids: { type: 'array', items: { type: 'integer' }, example: [1, 2] },
            title: { type: 'string', example: 'A day at Dinh Doc Lap' },
            slug: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', example: 'mot-ngay-tai-dinh-doc-lap' },
            thumbnail: { type: 'string', format: 'uri', nullable: true },
            content: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['draft', 'published', 'archived'] },
            published_at: { type: 'string', format: 'date-time', nullable: true },
            location_ids: { type: 'array', items: { type: 'integer' }, example: [1] },
          },
        },
        BlogMultipartInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string' },
            slug: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
            thumbnail_file: { type: 'string', format: 'binary' },
            content: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['draft', 'published', 'archived'], default: 'published' },
            published_at: { type: 'string', format: 'date-time', nullable: true },
            category_ids: { type: 'string', example: '[1,2]', description: 'JSON array string' },
            location_ids: { type: 'string', example: '[1]', description: 'JSON array string' },
          },
        },
        BlogMultipartUpdateInput: {
          type: 'object',
          minProperties: 1,
          properties: {
            title: { type: 'string' },
            slug: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
            thumbnail_file: { type: 'string', format: 'binary' },
            content: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['draft', 'published', 'archived'] },
            published_at: { type: 'string', format: 'date-time', nullable: true },
            category_ids: { type: 'string', example: '[1,2]', description: 'JSON array string' },
            location_ids: { type: 'string', example: '[1]', description: 'JSON array string' },
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
