# Travel360 Backend

Travel360 is a Node.js + Express backend for a travel booking platform. It supports travel destinations, tours, locations, maps, View360, bookings, SePay bank-transfer payments, coupons, blogs, reviews, staff operations, admin management, statistics, and AI suggestion placeholders.

## Tech Stack

- Node.js + Express
- PostgreSQL with `pg`
- JWT authentication
- Joi validation
- Swagger UI
- Winston + Morgan logging
- Multer upload middleware
- Node cron jobs
- SePay webhook payment flow

## Project Structure

```text
src/
  config/          App, DB, CORS, logger, Swagger config
  constants/       HTTP status and shared messages
  controllers/     Request handlers
  docs/            Swagger setup
  jobs/            Cron jobs
  middlewares/     Auth, validation, upload, error handling
  models/          PostgreSQL query layer
  routes/          Express routes and Swagger docs
  services/        Business logic
  utils/           Shared helpers
migrations/        Incremental database migrations
database_postgresql.sql
```

## Install

```bash
npm install
cp .env.example .env
```

Edit `.env`, then start the server:

```bash
npm run dev
```

Production:

```bash
npm start
```

Default URLs:

- Health: `GET http://localhost:3000/api/health`
- Swagger API docs: `http://localhost:3000/api-docs`

When the server starts, it logs both the API port and API docs URL.

## Environment Variables

Required core config:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=travel360
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_SSL=false

JWT_SECRET=change_me_to_a_long_random_secret
JWT_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173
```

Supabase pooler example:

```env
DB_HOST=aws-1-ap-northeast-2.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.project_ref
DB_PASSWORD=your_supabase_password
DB_SSL=true
```

SePay payment config:

```env
SEPAY_WEBHOOK_API_KEY=your_webhook_api_key
SEPAY_WEBHOOK_SECRET=
SEPAY_BANK_ACCOUNT=your_bank_account
SEPAY_BANK_NAME=your_bank_code
PAYMENT_CODE_PREFIX=TVL
PAYMENT_EXPIRE_MINUTES=15
```

AI and OAuth config:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
OPENAI_API_KEY=
```

Email notification config:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
REFUND_NOTIFY_EMAILS=refunds@example.com,staff@example.com
```

`REFUND_NOTIFY_EMAILS` is optional. If it is empty, refund request notifications are sent to active staff/admin emails from the database using BCC.

Zalo Bot config:

```env
ZALO_BOT_TOKEN=your_zalo_bot_token
ZALO_BOT_WEBHOOK_SECRET_TOKEN=your_webhook_secret_token
ZALO_PAYMENT_NOTIFY_CHAT_IDS=chat_id_or_group_id
```

Webhook URL:

```text
https://your-domain.com/api/webhooks/zalo
```

After configuring the webhook in Zalo Bot Creator/API, send `/chatid` to the bot to make it reply with the current chat ID. Put that value into `ZALO_PAYMENT_NOTIFY_CHAT_IDS` so payment-success notifications can be delivered.

## Database Setup

For a new database:

```bash
psql -U postgres -d travel360 -f database_postgresql.sql
```

For an existing database, run migrations in order:

```bash
psql -U postgres -d travel360 -f migrations/001_update_travel_destination.sql
psql -U postgres -d travel360 -f migrations/002_split_categories.sql
psql -U postgres -d travel360 -f migrations/003_add_user_profile_fields.sql
psql -U postgres -d travel360 -f migrations/003_update_location_timestamps.sql
psql -U postgres -d travel360 -f migrations/004_update_location_create_fields.sql
psql -U postgres -d travel360 -f migrations/005_update_view360_management.sql
psql -U postgres -d travel360 -f migrations/006_update_location_soft_delete.sql
psql -U postgres -d travel360 -f migrations/007_update_location_delete_fields.sql
psql -U postgres -d travel360 -f migrations/008_create_revoked_tokens.sql
psql -U postgres -d travel360 -f migrations/009_staff_coupon_management.sql
psql -U postgres -d travel360 -f migrations/019_customer_sepay_payment.sql
psql -U postgres -d travel360 -f migrations/020_rename_user_role_to_customer.sql
psql -U postgres -d travel360 -f migrations/023_add_booking_cancel_metadata.sql
psql -U postgres -d travel360 -f migrations/024_add_tour_start_at.sql
psql -U postgres -d travel360 -f migrations/025_create_refund_request.sql
psql -U postgres -d travel360 -f migrations/026_create_booking_status_history.sql
psql -U postgres -d travel360 -f migrations/027_add_booking_departure_at.sql
```

Some migration numbers are shared by older branch work. Run every file in `migrations/` that has not already been applied to your database.

## Roles

Current roles:

- `guest`: registered but not email-verified
- `customer`: verified customer account
- `staff`: staff operations
- `admin`: full admin management

Register flow:

1. `POST /api/auth/register` creates a `guest` account with `pending` status.
2. `POST /api/auth/verify-email` activates the account and changes role to `customer`.
3. `POST /api/auth/login` returns a JWT token.

Protected API header:

```http
Authorization: Bearer <jwt_token>
```

In Swagger, use **Authorize** and enter:

```text
Bearer <jwt_token>
```

For SePay webhook docs, use `sepayApiKey` authorization:

```text
Apikey <SEPAY_WEBHOOK_API_KEY>
```

## Main API Groups

Swagger is the source of truth for request bodies and responses:

```text
http://localhost:3000/api-docs
```

### Auth

- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-reset-code`
- `POST /api/auth/reset-password`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`

### Customer

Customer APIs require role `customer` where protected.

- `GET /api/bookings`
- `POST /api/bookings`
- `GET /api/bookings/:id`
- `PATCH /api/bookings/:id/cancel`
- `POST /api/payments`
- `GET /api/payments/:id`
- `GET /api/payments/:id/status`
- `POST /api/coupons/validate`
- `POST /api/locations/:locationId/reviews`
- `POST /api/reviews/:reviewId/photos`
- `POST /api/blogs`
- `PUT /api/blogs/:id`
- `DELETE /api/blogs/:id`

Customer booking rules:

- Customer can list and view only their own bookings.
- Customer cannot delete booking.
- Customer cannot directly mark booking as paid.
- Customer can cancel only unpaid bookings.
- Paid bookings require staff refund handling.

### Public Read APIs

- `GET /api/locations`
- `GET /api/locations/:id`
- `GET /api/maps/travel`
- `GET /api/maps/filter`
- `GET /api/maps/nearby`
- `GET /api/navigation/routes/:tourId`
- `GET /api/destination-categories`
- `GET /api/tour-categories`
- `GET /api/blogs`
- `GET /api/blogs/:id`
- `GET /api/reviews`
- `GET /api/reviews/:id`

Public discovery routes are read-only. Create, update, and delete operations belong under the role-specific prefixes below.

### Admin

Admin APIs require role `admin` and use prefix `/api/admin`.

- `/api/admin/users`
- `/api/admin/travel-destinations`
- `/api/admin/destination-categories`
- `/api/admin/tour-categories`
- `/api/admin/tours`
- `/api/admin/locations`
- `/api/admin/maps`
- `/api/admin/blogs`
- `/api/admin/media`

Admin blog content accepts sanitized rich-text HTML. Every `<img>` URL must reference an active image from `/api/admin/media`.
- `/api/admin/locations/:locationId/view360`
- `/api/admin/view360/:viewId`
- `/api/admin/view360/:viewId/images`
- `/api/admin/view360-images/:imageId`

Admin statistics:

- `GET /api/admin/statistics/system`
- `GET /api/admin/statistics/users`
- `GET /api/admin/statistics/locations`
- `GET /api/admin/statistics/content`

### Staff

Staff APIs require role `staff` or `admin` and use prefix `/api/staff`.

- `/api/staff/coupons`
- `/api/staff/bookings`
- `/api/staff/booking-details`
- `/api/staff/reviews`
- `/api/staff/payments`

Staff payment operations:

- `GET /api/staff/payments`
- `GET /api/staff/payments/:id`
- `PATCH /api/staff/payments/:id/status`
- `PATCH /api/staff/payments/:id/refund`

### Webhooks

SePay webhook:

- `POST /api/webhooks/sepay`

Required header:

```http
Authorization: Apikey <SEPAY_WEBHOOK_API_KEY>
```

Example payload:

```json
{
  "id": 61401120,
  "gateway": "MBBank",
  "transactionDate": "2026-06-01 17:16:00",
  "accountNumber": "6511223344",
  "code": "TVL00000798EB92",
  "content": "131564661280-TVL00000798EB92-CHUYEN TIEN",
  "transferType": "in",
  "transferAmount": 8500,
  "referenceCode": "FT26152540980426",
  "accumulated": 0
}
```

Webhook rules:

- Only money-in transactions are processed.
- Payment code must start with `TVL` or your configured `PAYMENT_CODE_PREFIX`.
- Duplicate webhook transaction IDs are ignored safely.
- Payment and booking are updated inside a DB transaction.
- Amount mismatch marks payment as `failed`.

## Business Modules

### Destination Categories and Tour Categories

Categories are split into two entities:

- `destination_category`: categorizes `travel_destination`
- `tour_category`: categorizes `tour`

`location` and `map` do not have category fields.

### Travel Destinations

`travel_destination` is the parent entity for:

- Locations
- Tours
- View360 scenes through locations
- Map data through locations

Admin endpoint:

```http
/api/admin/travel-destinations
```

### Locations

Location represents a specific area inside a travel destination, for example:

- Main Gate
- Beach Area
- Cave
- Historical Room

Admin delete uses soft delete and prevents deletion if related data exists.

### View360

Relationships:

```text
Location 1 - N View360
View360 1 - N View360Image
```

Admin manages View360 scenes and images:

- `GET /api/admin/locations/:locationId/view360`
- `POST /api/admin/locations/:locationId/view360`
- `PUT /api/admin/view360/:viewId`
- `DELETE /api/admin/view360/:viewId`
- `GET /api/admin/view360/:viewId/images`
- `POST /api/admin/view360/:viewId/images`
- `PUT /api/admin/view360-images/:imageId`
- `DELETE /api/admin/view360-images/:imageId`

### Coupons

Staff manages coupons:

- `GET /api/staff/coupons`
- `POST /api/staff/coupons`
- `GET /api/staff/coupons/:id`
- `PUT /api/staff/coupons/:id`
- `PATCH /api/staff/coupons/:id/archive`
- `DELETE /api/staff/coupons/:id`

Customer validates coupon before booking/payment:

```http
POST /api/coupons/validate
```

Coupon fields:

- `code`
- `discount_type`: `percentage` or `fixed`
- `discount_value`
- `max_discount_amount`
- `min_order_amount`
- `usage_limit`
- `used_count`
- `start_date`
- `end_date`
- `status`

Coupon lifecycle rules:

- `DELETE` is a soft delete for coupons created by mistake that have never been used or referenced by a booking.
- A deleted unused coupon code may be reused.
- Coupons that have been used cannot be deleted and should be archived.
- `Archive` permanently retires a coupon while preserving its code and booking history.
- Archived coupons cannot be updated, deleted, applied, or reused.

### Booking

Customer creates booking:

```http
POST /api/bookings
Authorization: Bearer <customer_token>
```

Example:

```json
{
  "tour_id": 1,
  "travel_date": "2026-07-15",
  "coupon_code": "SUMMER20",
  "passengers": [
    {
      "passenger_name": "Nguyen Van A",
      "age_category": "adult"
    }
  ]
}
```

Server rules:

- `user_id` is resolved from JWT, not from request body.
- Passenger `price`, `original_amount`, `discount_amount`, and `final_amount` are not accepted from the client.
- Passenger prices are calculated by server from tour ticket prices: adult uses `tour.price`, child uses `tour.child_price`, infant is free.
- `travel_date` is the customer-selected travel date. The backend combines it with the start time from `tour.schedule` to store `departure_at`.
- `status` starts as `pending`.
- `payment_status` starts as `unpaid`.
- `original_amount`, `discount_amount`, and `final_amount` are calculated by server.
- Invalid `tour_id` returns `404 Tour not found`.

Cancel booking:

```http
PATCH /api/bookings/:id/cancel
```

Optional body:

```json
{
  "reason": "I changed my travel plan"
}
```

Rules:

- Customer can cancel only their own booking.
- Customer can cancel only at least 24 hours before the booking `departure_at`.
- Pending payments are expired.
- Paid bookings create a pending 100% manual refund request and then cancel the booking.
- Cancellation stores `canceled_at`, `canceled_by`, and `cancel_reason`.

Staff reviews manual refund requests:

```http
GET /api/staff/refund-requests
PATCH /api/staff/refund-requests/:id/approve
PATCH /api/staff/refund-requests/:id/reject
```

After approval and manual money transfer, staff completes the refund:

```http
PATCH /api/staff/refund-requests/:id/complete
```

Email notifications:

- Customer receives booking cancellation email.
- Paid cancellation sends a manual refund request email to `REFUND_NOTIFY_EMAILS`; if empty, active staff/admin emails are used.
- Customer receives refund completed email after staff marks the refund completed.

Staff can inspect booking status history:

```http
GET /api/staff/bookings/:id/history
```

### Payment with SePay

Create payment:

```http
POST /api/payments
Authorization: Bearer <customer_token>
```

Payload:

```json
{
  "booking_id": 123
}
```

Response includes QR URL:

```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "payment_id": 1,
    "booking_id": 123,
    "payment_code": "TVL000123ABCD",
    "amount": 700000,
    "currency": "VND",
    "status": "pending",
    "bank_account": "123456789",
    "bank_name": "MBBank",
    "transfer_content": "TVL000123ABCD",
    "qr_url": "https://qr.sepay.vn/img?acc=123456789&bank=MBBank&amount=700000&des=TVL000123ABCD",
    "expired_at": "2026-06-01T10:15:00.000Z"
  }
}
```

Payment rules:

- Frontend cannot mark payment as paid.
- Only SePay webhook or staff operation can update paid/refund status.
- Payment code starts with `TVL`.
- Payment expires after `PAYMENT_EXPIRE_MINUTES`.
- Paid payment confirms the booking.

## Cron Jobs

Registered in `src/server.js`:

- `bookingExpiry.job.js`: expires old unpaid pending bookings.
- `paymentExpiry.job.js`: expires pending payments past `expired_at` and updates booking status.

## Useful Commands

```bash
npm run dev
npm start
npm run lint
```

Check one file manually:

```bash
node --check src/server.js
```

## Notes

- This project currently uses raw PostgreSQL queries through `pg`, not Sequelize.
- `src/services/chat.service.js` and `src/services/suggestion.service.js` are placeholders/rule-based helpers for future AI integration.
- Use Swagger `/api-docs` as the most accurate API reference during development.
