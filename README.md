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

## Endpoint chinh

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- CRUD: `/api/users`
- CRUD: `/api/categories`
- CRUD: `/api/travel-destinations`
- CRUD: `/api/tours`
- CRUD: `/api/locations`
- CRUD: `/api/maps`
- CRUD: `/api/view360`
- CRUD: `/api/view360-images`
- CRUD: `/api/bookings`
- CRUD: `/api/booking-details`
- CRUD: `/api/payments`
- CRUD: `/api/blogs`
- CRUD: `/api/blog-locations`
- CRUD: `/api/reviews`
- CRUD: `/api/statistics`
- `GET /api/statistics/dashboard/summary`
- `POST /api/chat`
- `POST /api/suggestions`

## Vi du payload

### Register

```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "secret123",
  "role": "admin"
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

## Ghi chu

- `src/services/chat.service.js` hien la placeholder de gan AI provider sau.
- `src/services/suggestion.service.js` dang goi y tour theo rule-based filters.
- `src/jobs/bookingExpiry.job.js` tu dong huy booking pending qua ngay.
