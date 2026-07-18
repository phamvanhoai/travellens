-- Coordinates are nullable so existing custom itinerary items remain valid.
ALTER TABLE group_trip_itinerary_item
    ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,7),
    ADD COLUMN IF NOT EXISTS longitude DECIMAL(10,7);

ALTER TABLE group_trip_itinerary_item
    DROP CONSTRAINT IF EXISTS chk_group_trip_itinerary_latitude,
    DROP CONSTRAINT IF EXISTS chk_group_trip_itinerary_longitude;

ALTER TABLE group_trip_itinerary_item
    ADD CONSTRAINT chk_group_trip_itinerary_latitude
        CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
    ADD CONSTRAINT chk_group_trip_itinerary_longitude
        CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180);
