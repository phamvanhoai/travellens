-- =========================================================
-- Travel System Database
-- PostgreSQL script generated from the provided ERD
-- =========================================================

DROP TABLE IF EXISTS statistics CASCADE;
DROP TABLE IF EXISTS revoked_tokens CASCADE;
DROP TABLE IF EXISTS review_photo CASCADE;
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS blog_location CASCADE;
DROP TABLE IF EXISTS blog CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS coupon CASCADE;
DROP TABLE IF EXISTS booking_detail CASCADE;
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
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'staff', 'user')),
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
    status VARCHAR(50) NOT NULL CHECK (status IN ('confirmed', 'canceled', 'pending')),
    payment_status VARCHAR(50) NOT NULL CHECK (payment_status IN ('paid', 'refunded', 'pending')),
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
        ON DELETE CASCADE
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
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    payment_method VARCHAR(100),
    payment_date TIMESTAMP,
    status VARCHAR(50) NOT NULL CHECK (status IN ('paid', 'pending', 'refunded')),
    transaction_code VARCHAR(255),
    currency VARCHAR(20),
    CONSTRAINT fk_payment_booking
        FOREIGN KEY (booking_id)
        REFERENCES booking(booking_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- =========================================================
-- Coupon
-- =========================================================
CREATE TABLE coupon (
    coupon_id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50) NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
    discount_value NUMERIC(12,2) NOT NULL CHECK (discount_value >= 0),
    min_order_amount NUMERIC(12,2) DEFAULT 0 CHECK (min_order_amount >= 0),
    max_discount_amount NUMERIC(12,2) CHECK (max_discount_amount IS NULL OR max_discount_amount >= 0),
    usage_limit INT CHECK (usage_limit IS NULL OR usage_limit >= 0),
    used_count INT NOT NULL DEFAULT 0 CHECK (used_count >= 0),
    starts_at TIMESTAMP,
    expires_at TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired'))
);

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
CREATE INDEX idx_booking_detail_booking_id ON booking_detail(booking_id);
CREATE INDEX idx_payment_booking_id ON payment(booking_id);
CREATE INDEX idx_review_location_id ON review(location_id);
CREATE INDEX idx_review_user_id ON review(user_id);
CREATE UNIQUE INDEX idx_review_user_location_unique
    ON review(user_id, location_id)
    WHERE deleted_at IS NULL;
CREATE INDEX idx_review_deleted_at ON review(deleted_at);
CREATE INDEX idx_review_photo_review_id ON review_photo(review_id);
CREATE INDEX idx_review_photo_deleted_at ON review_photo(deleted_at);
CREATE INDEX idx_coupon_code ON coupon(code);
CREATE INDEX idx_coupon_status ON coupon(status);
CREATE INDEX idx_blog_user_id ON blog(user_id);
CREATE INDEX idx_blog_location_blog_id ON blog_location(blog_id);
CREATE INDEX idx_blog_location_location_id ON blog_location(location_id);
CREATE INDEX idx_review_user_id ON review(user_id);
CREATE INDEX idx_review_location_id ON review(location_id);
CREATE INDEX idx_revoked_tokens_token_hash ON revoked_tokens(token_hash);
CREATE INDEX idx_revoked_tokens_expires_at ON revoked_tokens(expires_at);
