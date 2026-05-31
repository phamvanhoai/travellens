ALTER TABLE travel_destination
    ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

CREATE INDEX IF NOT EXISTS idx_travel_destination_coordinates
    ON travel_destination(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_location_coordinates
    ON location(latitude, longitude);
