-- =========================================================
-- Travel System Database
-- PostgreSQL script generated from the provided ERD
-- =========================================================

DROP TABLE IF EXISTS statistics CASCADE;
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS blog_location CASCADE;
DROP TABLE IF EXISTS blog CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS booking_detail CASCADE;
DROP TABLE IF EXISTS booking CASCADE;
DROP TABLE IF EXISTS view360_image CASCADE;
DROP TABLE IF EXISTS view360 CASCADE;
DROP TABLE IF EXISTS map CASCADE;
DROP TABLE IF EXISTS location CASCADE;
DROP TABLE IF EXISTS tour CASCADE;
DROP TABLE IF EXISTS travel_destination CASCADE;
DROP TABLE IF EXISTS category CASCADE;
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
    avatar_url TEXT
);

-- =========================================================
-- Category
-- =========================================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT
);

-- =========================================================
-- TravelDestination
-- =========================================================
CREATE TABLE travel_destination (
    destination_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INT,
    CONSTRAINT fk_travel_destination_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- =========================================================
-- Tour
-- =========================================================
CREATE TABLE tour (
    tour_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    schedule TEXT,
    capacity INT CHECK (capacity >= 0),
    destination_id INT NOT NULL,
    category_id INT,
    CONSTRAINT fk_tour_destination
        FOREIGN KEY (destination_id)
        REFERENCES travel_destination(destination_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_tour_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
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
    category_id INT,
    destination_id INT,
    CONSTRAINT fk_location_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
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
    map_file TEXT,
    description TEXT,
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
    description TEXT,
    audio_file TEXT,
    language VARCHAR(50),
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
CREATE INDEX idx_travel_destination_category_id ON travel_destination(category_id);
CREATE INDEX idx_tour_destination_id ON tour(destination_id);
CREATE INDEX idx_tour_category_id ON tour(category_id);
CREATE INDEX idx_location_category_id ON location(category_id);
CREATE INDEX idx_location_destination_id ON location(destination_id);
CREATE INDEX idx_map_location_id ON map(location_id);
CREATE INDEX idx_view360_location_id ON view360(location_id);
CREATE INDEX idx_view360_image_view_id ON view360_image(view_id);
CREATE INDEX idx_booking_user_id ON booking(user_id);
CREATE INDEX idx_booking_tour_id ON booking(tour_id);
CREATE INDEX idx_booking_detail_booking_id ON booking_detail(booking_id);
CREATE INDEX idx_payment_booking_id ON payment(booking_id);
CREATE INDEX idx_blog_user_id ON blog(user_id);
CREATE INDEX idx_blog_location_blog_id ON blog_location(blog_id);
CREATE INDEX idx_blog_location_location_id ON blog_location(location_id);
CREATE INDEX idx_review_user_id ON review(user_id);
CREATE INDEX idx_review_location_id ON review(location_id);
