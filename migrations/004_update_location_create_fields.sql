ALTER TABLE location
    ADD COLUMN IF NOT EXISTS thumbnail TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_location_destination_name_unique
    ON location(destination_id, LOWER(name));

