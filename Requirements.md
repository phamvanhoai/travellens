# Travel360 - Full Project Requirements for AI Source Generation

## 1. Project Overview

Travel360 is a Node.js + Express backend system for a travel booking platform with AI integration. It supports:

* User registration, login (email/password + Google OAuth)
* TravelDestination, Tour, and Location management
* Viewing Map, View360, View360Image for Locations
* Booking with multiple tickets (adult/child/infant)
* Payment processing with partial/refund support
* Blog creation linked to Locations
* Reviews for Locations
* Dashboard statistics for Admin
* AI ChatBox & travel suggestions

---

## 2. Full Folder Structure

```
travel360/
├─ .env                   # Environment configuration
├─ .gitignore
├─ package.json
├─ package-lock.json
├─ README.md
├─ logs/                  # Log files
│   ├─ combined.log
│   └─ error.log
├─ public/                # Static files
│   ├─ images/            # 360 images
│   └─ maps/              # Map files
├─ src/
│   ├─ server.js          # Entry point, initializes Express app
│   ├─ config/            # Configuration
│   │   ├─ db.js          # DB connection
│   │   ├─ cors.js        # CORS configuration
│   │   ├─ logger.js      # Logging setup
│   │   └─ index.js       # Export all config
│   ├─ constants/         # Global constants
│   │   ├─ httpStatus.js
│   │   ├─ messages.js
│   │   └─ index.js
│   ├─ controllers/       # Handle requests, call services
│   │   ├─ auth.controller.js
│   │   ├─ user.controller.js
│   │   ├─ tour.controller.js
│   │   ├─ travelDestination.controller.js
│   │   ├─ location.controller.js
│   │   ├─ view360.controller.js
│   │   ├─ view360Image.controller.js
│   │   ├─ map.controller.js
│   │   ├─ booking.controller.js
│   │   ├─ bookingDetail.controller.js
│   │   ├─ payment.controller.js
│   │   ├─ blog.controller.js
│   │   ├─ blogLocation.controller.js
│   │   ├─ review.controller.js
│   │   ├─ statistics.controller.js
│   │   ├─ chat.controller.js
│   │   └─ suggestion.controller.js
│   ├─ services/          # Business logic, AI integration
│   │   ├─ auth.service.js
│   │   ├─ user.service.js
│   │   ├─ tour.service.js
│   │   ├─ travelDestination.service.js
│   │   ├─ location.service.js
│   │   ├─ view360.service.js
│   │   ├─ view360Image.service.js
│   │   ├─ map.service.js
│   │   ├─ booking.service.js
│   │   ├─ bookingDetail.service.js
│   │   ├─ payment.service.js
│   │   ├─ blog.service.js
│   │   ├─ blogLocation.service.js
│   │   ├─ review.service.js
│   │   ├─ statistics.service.js
│   │   ├─ chat.service.js
│   │   └─ suggestion.service.js
│   ├─ models/            # Database models
│   │   ├─ user.model.js
│   │   ├─ category.model.js
│   │   ├─ tour.model.js
│   │   ├─ travelDestination.model.js
│   │   ├─ location.model.js
│   │   ├─ view360.model.js
│   │   ├─ view360Image.model.js
│   │   ├─ map.model.js
│   │   ├─ booking.model.js
│   │   ├─ bookingDetail.model.js
│   │   ├─ payment.model.js
│   │   ├─ blog.model.js
│   │   ├─ blogLocation.model.js
│   │   ├─ review.model.js
│   │   └─ statistics.model.js
│   ├─ routes/            # API endpoints
│   │   ├─ auth.route.js
│   │   ├─ user.route.js
│   │   ├─ tour.route.js
│   │   ├─ travelDestination.route.js
│   │   ├─ location.route.js
│   │   ├─ view360.route.js
│   │   ├─ view360Image.route.js
│   │   ├─ map.route.js
│   │   ├─ booking.route.js
│   │   ├─ bookingDetail.route.js
│   │   ├─ payment.route.js
│   │   ├─ blog.route.js
│   │   ├─ blogLocation.route.js
│   │   ├─ review.route.js
│   │   ├─ statistics.route.js
│   │   ├─ chat.route.js
│   │   └─ suggestion.route.js
│   ├─ middlewares/
│   │   ├─ auth.middleware.js
│   │   ├─ error.middleware.js
│   │   ├─ rateLimiter.middleware.js
│   │   └─ validate.middleware.js
│   ├─ validators/
│   │   ├─ auth.validator.js
│   │   ├─ user.validator.js
│   │   ├─ tour.validator.js
│   │   ├─ travelDestination.validator.js
│   │   ├─ location.validator.js
│   │   ├─ view360.validator.js
│   │   ├─ booking.validator.js
│   │   ├─ payment.validator.js
│   │   └─ index.js
│   ├─ utils/
│   │   ├─ ApiError.js
│   │   ├─ asyncHandler.js
│   │   ├─ pick.js
│   │   └─ responseHandler.js
│   ├─ docs/
│   │   └─ swagger.js
│   └─ jobs/
│       └─ bookingExpiry.job.js
```

---

## 3. Nghiệp vụ AI cần tạo source mẫu

1. **User Management:** register/login (Email + Google OAuth), profile update, role handling
2. **Tour & Booking:** create tours, manage capacity, booking multiple tickets, handle cancellations, partial/full payments
3. **Location:** manage multiple Locations per TravelDestination, Map + View360 + View360Image
4. **Blog & Review:** create blogs linked to Locations, write reviews with images
5. **Statistics:** generate reports for Admin dashboard (booking summary, revenue, cancellations)
6. **View360 & View360Image:** multiple views, multiple images per view, audio + description
7. **Map:** store map files and descriptions for Locations
8. **API Structure:** controllers, services, routes with proper middleware
9. **Jobs:** booking expiry, reminders, email notifications

---

## 4. Yêu cầu AI

* Sinh source mẫu Node.js + Express dựa trên folder structure và models
* Tạo controllers, services, routes cho toàn bộ entity
* Tạo mối quan hệ database chuẩn theo ERD
* Hỗ trợ login Email + Google OAuth
* Hỗ trợ Booking nhiều vé và nhiều loại khách
* Hỗ trợ View360, View360Image, Map
* Hỗ trợ Payment, Statistics, Blog, Review
