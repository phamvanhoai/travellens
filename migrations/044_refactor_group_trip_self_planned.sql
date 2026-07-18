-- Refactor group trips into independent, self-planned trips.

ALTER TABLE group_trip
    ALTER COLUMN booking_id DROP NOT NULL,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS destination_id INT,
    ADD COLUMN IF NOT EXISTS destination_name VARCHAR(200),
    ADD COLUMN IF NOT EXISTS start_date DATE,
    ADD COLUMN IF NOT EXISTS end_date DATE,
    ADD COLUMN IF NOT EXISTS max_members INT;

ALTER TABLE group_trip
    DROP CONSTRAINT IF EXISTS uq_group_trip_booking;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_group_trip_destination') THEN
        ALTER TABLE group_trip
            ADD CONSTRAINT fk_group_trip_destination
            FOREIGN KEY (destination_id) REFERENCES travel_destination(destination_id) ON DELETE SET NULL;
    END IF;
END $$;

ALTER TABLE group_trip
    DROP CONSTRAINT IF EXISTS chk_group_trip_dates,
    DROP CONSTRAINT IF EXISTS chk_group_trip_max_members;

ALTER TABLE group_trip
    ADD CONSTRAINT chk_group_trip_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
    ADD CONSTRAINT chk_group_trip_max_members CHECK (max_members IS NULL OR max_members >= 2);

CREATE TABLE IF NOT EXISTS group_trip_itinerary_item (
    itinerary_item_id SERIAL PRIMARY KEY,
    group_trip_id INT NOT NULL,
    itinerary_date DATE NOT NULL,
    start_time TIME,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location_id INT,
    custom_location VARCHAR(255),
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_group_trip_itinerary_trip FOREIGN KEY (group_trip_id)
        REFERENCES group_trip(group_trip_id) ON DELETE CASCADE,
    CONSTRAINT fk_group_trip_itinerary_location FOREIGN KEY (location_id)
        REFERENCES location(location_id) ON DELETE SET NULL,
    CONSTRAINT chk_group_trip_itinerary_order CHECK (order_index >= 0)
);

CREATE INDEX IF NOT EXISTS idx_group_trip_itinerary_trip_date
    ON group_trip_itinerary_item(group_trip_id, itinerary_date, order_index);
