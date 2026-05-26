ALTER TABLE location
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_location_deleted_at
    ON location(deleted_at);

DROP INDEX IF EXISTS idx_location_destination_name_unique;

CREATE UNIQUE INDEX IF NOT EXISTS idx_location_destination_name_unique
    ON location(destination_id, LOWER(name))
    WHERE deleted_at IS NULL;

