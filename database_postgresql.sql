-- =========================================================
-- Travel System Database
-- PostgreSQL script generated from the provided ERD
-- =========================================================

DROP TABLE IF EXISTS statistics CASCADE;
DROP TABLE IF EXISTS revoked_tokens CASCADE;
DROP TABLE IF EXISTS review_photo CASCADE;
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS blog_location CASCADE;
DROP TABLE IF EXISTS media_file CASCADE;
DROP TABLE IF EXISTS blog CASCADE;
DROP TABLE IF EXISTS refund_request CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS coupon CASCADE;
DROP TABLE IF EXISTS booking_detail CASCADE;
DROP TABLE IF EXISTS booking_status_history CASCADE;
DROP TABLE IF EXISTS booking CASCADE;
DROP TABLE IF EXISTS view360_image CASCADE;
DROP TABLE IF EXISTS view360 CASCADE;
DROP TABLE IF EXISTS map CASCADE;
DROP TABLE IF EXISTS location CASCADE;
DROP TABLE IF EXISTS tour CASCADE;
DROP TABLE IF EXISTS travel_destination CASCADE;
DROP TABLE IF EXISTS tour_category CASCADE;
DROP TABLE IF EXISTS destination_category CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =========================================================
-- User
-- NOTE: "User" is a reserved keyword in PostgreSQL,
-- so the table is named "users".
-- =========================================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('guest', 'customer', 'staff', 'admin')),
    status VARCHAR(50),
    profile_info TEXT,
    google_id VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    phone VARCHAR(30),
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT
);

-- =========================================================
-- RevokedToken
-- =========================================================
CREATE TABLE revoked_tokens (
    revoked_token_id SERIAL PRIMARY KEY,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    user_id INTEGER,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_revoked_tokens_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

-- =========================================================
-- DestinationCategory
-- =========================================================
CREATE TABLE destination_category (
    destination_category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- TourCategory
-- =========================================================
CREATE TABLE tour_category (
    tour_category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- TravelDestination
-- =========================================================
CREATE TABLE travel_destination (
    destination_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    thumbnail TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    destination_category_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_travel_destination_destination_category
        FOREIGN KEY (destination_category_id)
        REFERENCES destination_category(destination_category_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- =========================================================
-- Tour
-- =========================================================
CREATE TABLE tour (
    tour_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    schedule TEXT,
    start_at TIMESTAMP,
    capacity INT CHECK (capacity >= 0),
    thumbnail TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft', 'deleted')),
    tour_category_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_tour_tour_category
        FOREIGN KEY (tour_category_id)
        REFERENCES tour_category(tour_category_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- =========================================================
-- TourDestination
-- =========================================================
CREATE TABLE tour_destination (
    tour_destination_id SERIAL PRIMARY KEY,
    tour_id INT NOT NULL,
    destination_id INT NOT NULL,
    order_index INT NOT NULL CHECK (order_index >= 1),
    estimated_time VARCHAR(100),
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tour_destination_tour
        FOREIGN KEY (tour_id)
        REFERENCES tour(tour_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_tour_destination_destination
        FOREIGN KEY (destination_id)
        REFERENCES travel_destination(destination_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT uq_tour_destination_destination
        UNIQUE (tour_id, destination_id),
    CONSTRAINT uq_tour_destination_order
        UNIQUE (tour_id, order_index)
);

-- =========================================================
-- Location
-- =========================================================
CREATE TABLE location (
    location_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    description TEXT,
    thumbnail TEXT,
    destination_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_location_destination
        FOREIGN KEY (destination_id)
        REFERENCES travel_destination(destination_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================================================
-- Map
-- =========================================================
CREATE TABLE map (
    map_id SERIAL PRIMARY KEY,
    location_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    map_file TEXT,
    description TEXT,
    display_order INT CHECK (display_order IS NULL OR display_order >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_map_location
        FOREIGN KEY (location_id)
        REFERENCES location(location_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================================================
-- View360
-- =========================================================
CREATE TABLE view360 (
    view_id SERIAL PRIMARY KEY,
    location_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    audio_file TEXT,
    language VARCHAR(50),
    order_index INT CHECK (order_index IS NULL OR order_index >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_view360_location
        FOREIGN KEY (location_id)
        REFERENCES location(location_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================================================
-- View360Image
-- =========================================================
CREATE TABLE view360_image (
    image_id SERIAL PRIMARY KEY,
    view_id INT NOT NULL,
    image_file TEXT NOT NULL,
    order_index INT CHECK (order_index >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_view360_image_view360
        FOREIGN KEY (view_id)
        REFERENCES view360(view_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================================================
-- Booking
-- =========================================================
CREATE TABLE booking (
    booking_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    tour_id INT NOT NULL,
    coupon_id INT,
    departure_at TIMESTAMP,
    original_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (original_amount >= 0),
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    final_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (final_amount >= 0),
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'confirmed', 'canceled', 'expired')),
    payment_status VARCHAR(50) NOT NULL CHECK (payment_status IN ('unpaid', 'paid', 'failed', 'refunded', 'pending')),
    canceled_at TIMESTAMP,
    canceled_by INT,
    cancel_reason TEXT,
    date_created DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_booking_tour
        FOREIGN KEY (tour_id)
        REFERENCES tour(tour_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_booking_canceled_by
        FOREIGN KEY (canceled_by)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- =========================================================
-- BookingStatusHistory
-- =========================================================
CREATE TABLE booking_status_history (
    booking_status_history_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    from_status VARCHAR(50),
    to_status VARCHAR(50),
    from_payment_status VARCHAR(50),
    to_payment_status VARCHAR(50),
    reason TEXT,
    changed_by INT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_status_history_booking
        FOREIGN KEY (booking_id)
        REFERENCES booking(booking_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_booking_status_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- =========================================================
-- BookingDetail
-- =========================================================
CREATE TABLE booking_detail (
    booking_detail_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    passenger_name VARCHAR(150) NOT NULL,
    age_category VARCHAR(50) NOT NULL CHECK (age_category IN ('adult', 'child', 'infant')),
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    seat_number VARCHAR(50),
    special_request TEXT,
    CONSTRAINT fk_booking_detail_booking
        FOREIGN KEY (booking_id)
        REFERENCES booking(booking_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================================================
-- Payment
-- =========================================================
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_code VARCHAR(50) NOT NULL UNIQUE,
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    payment_method VARCHAR(100) DEFAULT 'bank_transfer',
    payment_provider VARCHAR(50) DEFAULT 'sepay',
    payment_date TIMESTAMP,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'expired', 'refunded')),
    transaction_code VARCHAR(255),
    sepay_transaction_id VARCHAR(100) UNIQUE,
    bank_account VARCHAR(100),
    transfer_content TEXT,
    paid_at TIMESTAMP,
    expired_at TIMESTAMP,
    currency VARCHAR(20) DEFAULT 'VND',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_payment_booking
        FOREIGN KEY (booking_id)
        REFERENCES booking(booking_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================================================
-- RefundRequest
-- =========================================================
CREATE TABLE refund_request (
    refund_request_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_id INT NOT NULL,
    requested_by INT,
    reason TEXT,
    refund_amount NUMERIC(12,2) NOT NULL CHECK (refund_amount >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    staff_note TEXT,
    completed_by INT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refund_request_booking
        FOREIGN KEY (booking_id)
        REFERENCES booking(booking_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_refund_request_payment
        FOREIGN KEY (payment_id)
        REFERENCES payment(payment_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_refund_request_requested_by
        FOREIGN KEY (requested_by)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT fk_refund_request_completed_by
        FOREIGN KEY (completed_by)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE sepay_webhook_log (
    sepay_webhook_log_id SERIAL PRIMARY KEY,
    sepay_transaction_id VARCHAR(100) NOT NULL UNIQUE,
    payment_id INT,
    payment_code VARCHAR(50),
    transfer_amount NUMERIC(12,2),
    transfer_type VARCHAR(50),
    raw_payload JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'received',
    message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sepay_webhook_log_payment
        FOREIGN KEY (payment_id)
        REFERENCES payment(payment_id)
        ON DELETE SET NULL
);

-- =========================================================
-- Coupon
-- =========================================================
CREATE TABLE coupon (
    coupon_id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(12,2) NOT NULL CHECK (discount_value >= 0),
    min_order_amount NUMERIC(12,2) DEFAULT 0 CHECK (min_order_amount >= 0),
    max_discount_amount NUMERIC(12,2) CHECK (max_discount_amount IS NULL OR max_discount_amount >= 0),
    usage_limit INT CHECK (usage_limit IS NULL OR usage_limit > 0),
    used_count INT NOT NULL DEFAULT 0 CHECK (used_count >= 0),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'archived')),
    created_by INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    archived_at TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_coupon_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

ALTER TABLE booking
    ADD CONSTRAINT fk_booking_coupon
    FOREIGN KEY (coupon_id)
    REFERENCES coupon(coupon_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;

-- =========================================================
-- Blog
-- =========================================================
CREATE TABLE blog (
    blog_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    date_created DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT fk_blog_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================================================
-- Blog_Location
-- =========================================================
CREATE TABLE blog_location (
    blog_id INT NOT NULL,
    location_id INT NOT NULL,
    PRIMARY KEY (blog_id, location_id),
    CONSTRAINT fk_blog_location_blog
        FOREIGN KEY (blog_id)
        REFERENCES blog(blog_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_blog_location_location
        FOREIGN KEY (location_id)
        REFERENCES location(location_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================================================
-- Media File (reusable blog image library)
-- =========================================================
CREATE TABLE media_file (
    media_id SERIAL PRIMARY KEY,
    uploaded_by INT,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL UNIQUE,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL CHECK (file_size >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_media_file_uploaded_by
        FOREIGN KEY (uploaded_by)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- =========================================================
-- Review
-- =========================================================
CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    location_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    images TEXT,
    date_created DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_review_location
        FOREIGN KEY (location_id)
        REFERENCES location(location_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================================================
-- ReviewPhoto
-- =========================================================
CREATE TABLE review_photo (
    photo_id SERIAL PRIMARY KEY,
    review_id INT NOT NULL,
    photo_url TEXT NOT NULL,
    original_name VARCHAR(255),
    mime_type VARCHAR(100),
    file_size INT CHECK (file_size IS NULL OR file_size >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_review_photo_review
        FOREIGN KEY (review_id)
        REFERENCES review(review_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================================================
-- Statistics
-- =========================================================
CREATE TABLE statistics (
    stat_id SERIAL PRIMARY KEY,
    type VARCHAR(100),
    data JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- Indexes for foreign keys
-- =========================================================
CREATE INDEX idx_travel_destination_destination_category_id ON travel_destination(destination_category_id);
CREATE INDEX idx_destination_category_name ON destination_category(name);
CREATE INDEX idx_tour_category_name ON tour_category(name);
CREATE UNIQUE INDEX idx_travel_destination_name_unique ON travel_destination(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_travel_destination_deleted_at ON travel_destination(deleted_at);
CREATE INDEX idx_tour_tour_category_id ON tour(tour_category_id);
CREATE INDEX idx_tour_status ON tour(status);
CREATE INDEX idx_tour_start_at ON tour(start_at);
CREATE INDEX idx_tour_created_at ON tour(created_at);
CREATE INDEX idx_tour_deleted_at ON tour(deleted_at);
CREATE INDEX idx_tour_destination_tour_id ON tour_destination(tour_id);
CREATE INDEX idx_tour_destination_destination_id ON tour_destination(destination_id);
CREATE INDEX idx_location_destination_id ON location(destination_id);
CREATE UNIQUE INDEX idx_location_destination_name_unique ON location(destination_id, LOWER(name)) WHERE is_deleted = FALSE;
CREATE INDEX idx_location_deleted_at ON location(deleted_at);
CREATE INDEX idx_map_location_id ON map(location_id);
CREATE INDEX idx_map_deleted_at ON map(deleted_at);
CREATE INDEX idx_map_is_deleted ON map(is_deleted);
CREATE INDEX idx_view360_location_id ON view360(location_id);
CREATE INDEX idx_view360_image_view_id ON view360_image(view_id);
CREATE INDEX idx_view360_deleted_at ON view360(deleted_at);
CREATE INDEX idx_view360_image_deleted_at ON view360_image(deleted_at);
CREATE INDEX idx_booking_user_id ON booking(user_id);
CREATE INDEX idx_booking_tour_id ON booking(tour_id);
CREATE INDEX idx_booking_coupon_id ON booking(coupon_id);
CREATE INDEX idx_booking_departure_at ON booking(departure_at);
CREATE INDEX idx_booking_tour_departure_at ON booking(tour_id, departure_at);
CREATE INDEX idx_booking_canceled_at ON booking(canceled_at);
CREATE INDEX idx_booking_canceled_by ON booking(canceled_by);
CREATE INDEX idx_booking_status_history_booking_id ON booking_status_history(booking_id);
CREATE INDEX idx_booking_status_history_created_at ON booking_status_history(created_at);
CREATE INDEX idx_booking_status_history_action ON booking_status_history(action);
CREATE INDEX idx_booking_detail_booking_id ON booking_detail(booking_id);
CREATE INDEX idx_payment_booking_id ON payment(booking_id);
CREATE UNIQUE INDEX idx_refund_request_pending_booking
    ON refund_request(booking_id)
    WHERE status = 'pending';
CREATE INDEX idx_refund_request_status ON refund_request(status);
CREATE INDEX idx_refund_request_payment_id ON refund_request(payment_id);
CREATE INDEX idx_refund_request_requested_by ON refund_request(requested_by);
CREATE INDEX idx_review_location_id ON review(location_id);
CREATE INDEX idx_review_user_id ON review(user_id);
CREATE UNIQUE INDEX idx_review_user_location_unique
    ON review(user_id, location_id)
    WHERE deleted_at IS NULL;
CREATE INDEX idx_review_deleted_at ON review(deleted_at);
CREATE INDEX idx_review_photo_review_id ON review_photo(review_id);
CREATE INDEX idx_review_photo_deleted_at ON review_photo(deleted_at);
CREATE INDEX idx_coupon_code ON coupon(code);
CREATE UNIQUE INDEX uq_coupon_active_code ON coupon(UPPER(code)) WHERE deleted_at IS NULL;
CREATE INDEX idx_coupon_status ON coupon(status);
CREATE INDEX idx_coupon_deleted_at ON coupon(deleted_at);
CREATE INDEX idx_blog_user_id ON blog(user_id);
CREATE INDEX idx_blog_location_blog_id ON blog_location(blog_id);
CREATE INDEX idx_blog_location_location_id ON blog_location(location_id);
CREATE INDEX idx_media_file_created_at ON media_file(created_at DESC);
CREATE INDEX idx_media_file_deleted_at ON media_file(deleted_at);
CREATE INDEX idx_media_file_uploaded_by ON media_file(uploaded_by);
CREATE INDEX idx_review_user_id ON review(user_id);
CREATE INDEX idx_review_location_id ON review(location_id);
CREATE INDEX idx_revoked_tokens_token_hash ON revoked_tokens(token_hash);
CREATE INDEX idx_revoked_tokens_expires_at ON revoked_tokens(expires_at);
