# TravelLens / Travel360 Backend

Node.js + Express backend mau cho he thong dat tour du lich, quan ly dia diem, map, View360, booking nhieu ve, thanh toan, blog, review, dashboard statistics va AI suggestion placeholder.

## Tech stack

- Node.js + Express
- PostgreSQL qua `pg`
- JWT authentication
- Joi validation
- Winston + Morgan logging
- Swagger UI
- Node cron job cho booking het han

## Cai dat

```bash
npm install
cp .env.example .env
```

Sua `DATABASE_URL` va `JWT_SECRET` trong `.env`, sau do tao database bang:

```bash
psql -U postgres -d travel360 -f database_postgresql.sql
```

Chay development server:

```bash
npm run dev
```

Hoac production:

```bash
npm start
```

API mac dinh chay tai:

- `GET /api/health`
- Swagger: `/api-docs`

## Authentication

Sau khi register hoac login, API tra ve JWT token. Voi cac API can dang nhap, gui header:

```http
Authorization: Bearer <token>
```

Neu dung Swagger tai `/api-docs`, bam nut `Authorize` va nhap:

```text
Bearer <token>
```

## Endpoint chinh

Category da duoc tach thanh 2 entity rieng:

- `DestinationCategory`: phan loai `TravelDestination` nhu Historical, Nature, Beach.
- `TourCategory`: phan loai `Tour` nhu Family, Adventure, Luxury.
- `Location` va `Map` khong con category.

Guest/Customer endpoints khong can prefix role rieng:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `GET /api/travel-destinations`
- `GET /api/tours`
- `GET /api/locations`
- `GET /api/maps`
- `GET /api/view360`
- `GET /api/view360-images`
- `GET /api/coupons`
- `GET /api/destination-categories`
- `GET /api/tour-categories`
- `GET /api/blogs`
- `POST /api/blogs`
- `GET /api/reviews`
- `POST /api/reviews`
- CRUD: `/api/bookings`
- CRUD: `/api/booking-details`
- CRUD: `/api/payments`
- `POST /api/chat`
- `POST /api/suggestions`

Admin endpoints dung prefix `/api/admin` va yeu cau token co role `admin`:

- CRUD: `/api/admin/users`
- CRUD: `/api/admin/destination-categories`
- CRUD: `/api/admin/tour-categories`
- CRUD: `/api/admin/travel-destinations`
- CRUD: `/api/admin/tours`
- CRUD: `/api/admin/locations`
- CRUD: `/api/admin/blogs`
- CRUD: `/api/admin/maps`
- CRUD: `/api/admin/statistics`
- `GET /api/admin/statistics/system`
- `GET /api/admin/statistics/users`
- `GET /api/admin/statistics/locations`
- `GET /api/admin/statistics/content`
- `GET /api/admin/locations?page=1&limit=10&search=dinh&destination_id=1&sortBy=created_at&sortOrder=DESC`
- `POST /api/admin/locations`
- `GET /api/admin/locations/:locationId/view360`
- `POST /api/admin/locations/:locationId/view360`
- `PUT /api/admin/view360/:viewId`
- `DELETE /api/admin/view360/:viewId`
- `GET /api/admin/view360/:viewId/images`
- `POST /api/admin/view360/:viewId/images`
- `PUT /api/admin/view360-images/:imageId`
- `DELETE /api/admin/view360-images/:imageId`

Vi du header admin:

```http
Authorization: Bearer <admin_token>
```

### Admin Travel Destinations

Module `/api/admin/travel-destinations` dung de admin quan ly diem den du lich tong the. `TravelDestination` la entity cha cua `Tour` va `Location`.

Endpoints:

- `POST /api/admin/travel-destinations`
- `GET /api/admin/travel-destinations?page=1&limit=10&search=dinh&destination_category_id=1`
- `GET /api/admin/travel-destinations/:id`
- `PUT /api/admin/travel-destinations/:id`
- `DELETE /api/admin/travel-destinations/:id`

Create payload:

```json
{
  "name": "Dinh Doc Lap",
  "description": "Historic landmark in Ho Chi Minh City",
  "thumbnail": "https://example.com/dinhdoclap.jpg",
  "destination_category_id": 1
}
```

Tour payload dung `tour_category_id`:

```json
{
  "name": "Dinh Doc Lap Half Day Tour",
  "description": "Guided tour package",
  "price": 500000,
  "schedule": "08:00 - 12:00",
  "capacity": 30,
  "destination_id": 1,
  "tour_category_id": 1
}
```

Business logic da ho tro:

- Check JWT va role `admin` qua prefix `/api/admin`
- Validate body
- Check destination name khong trung
- Pagination/search/filter category
- Sort theo `created_at`
- Detail include `locations`, `tours`, `view360`, `statistics`
- `PUT` co the update mot phan field, khong bat buoc gui day du resource
- Delete dang soft delete va chan xoa neu con `tour` hoac `location`

Neu database da tao truoc do, chay migration:

```bash
psql -U postgres -d travel360 -f migrations/001_update_travel_destination.sql
psql -U postgres -d travel360 -f migrations/002_split_categories.sql
psql -U postgres -d travel360 -f migrations/003_update_location_timestamps.sql
psql -U postgres -d travel360 -f migrations/004_update_location_create_fields.sql
psql -U postgres -d travel360 -f migrations/005_update_view360_management.sql
```

ERD sau refactor nam tai `docs/ERD.md`.

Staff endpoints dung prefix `/api/staff` va yeu cau token co role `staff` hoac `admin`:

- CRUD: `/api/staff/reviews`
- CRUD: `/api/staff/coupons`
- CRUD: `/api/staff/bookings`
- CRUD: `/api/staff/booking-details`
- CRUD: `/api/staff/payments`

Vi du header staff:

```http
Authorization: Bearer <staff_token>
```

## Vi du payload

### Register

```json
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "secret123",
  "profile_info": "Travel lover from Da Nang",
  "avatar_url": "https://example.com/avatar.png"
}
```

Response:

```json
{
  "success": true,
  "message": "Registered successfully",
  "data": {
    "user": {
      "user_id": 1,
      "name": "Nguyen Van A",
      "email": "user@example.com",
      "role": "user",
      "status": "active",
      "profile_info": "Travel lover from Da Nang",
      "google_id": null,
      "avatar_url": "https://example.com/avatar.png"
    },
    "token": "<jwt_token>"
  }
}
```

### Login

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Response:

```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "user_id": 1,
      "name": "Nguyen Van A",
      "email": "user@example.com",
      "role": "user",
      "status": "active"
    },
    "token": "<jwt_token>"
  }
}
```

### Get Profile

```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Update Profile

```http
PUT /api/auth/profile
Authorization: Bearer <token>
```

```json
{
  "name": "Nguyen Van A",
  "profile_info": "Loves beaches and mountain trips",
  "avatar_url": "https://example.com/avatar.png"
}
```

### Booking nhieu ve

```json
{
  "user_id": 1,
  "tour_id": 1,
  "passengers": [
    {
      "passenger_name": "Nguyen Van A",
      "age_category": "adult",
      "price": 1200000
    },
    {
      "passenger_name": "Nguyen Van B",
      "age_category": "child",
      "price": 800000
    }
  ]
}
```

### Payment

```json
{
  "booking_id": 1,
  "amount": 2000000,
  "payment_method": "bank_transfer",
  "status": "paid",
  "transaction_code": "TXN001",
  "currency": "VND"
}
```

### Coupon

```json
{
  "code": "SUMMER10",
  "name": "Summer discount",
  "description": "Discount for summer tours",
  "discount_type": "percent",
  "discount_value": 10,
  "min_order_amount": 1000000,
  "max_discount_amount": 300000,
  "usage_limit": 100,
  "starts_at": "2026-06-01T00:00:00.000Z",
  "expires_at": "2026-08-31T23:59:59.000Z",
  "status": "active"
}
```

Coupon endpoints:

- `GET /api/coupons`
- `POST /api/coupons`
- `GET /api/coupons/:id`
- `PUT /api/coupons/:id`
- `DELETE /api/coupons/:id`

## Ghi chu

- `src/services/chat.service.js` hien la placeholder de gan AI provider sau.
- `src/services/suggestion.service.js` dang goi y tour theo rule-based filters.
- `src/jobs/bookingExpiry.job.js` tu dong huy booking pending qua ngay.
