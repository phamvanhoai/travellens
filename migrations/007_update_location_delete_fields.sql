ALTER TABLE location
    ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE location
SET is_deleted = TRUE
WHERE deleted_at IS NOT NULL;

DROP INDEX IF EXISTS idx_location_destination_name_unique;

CREATE UNIQUE INDEX IF NOT EXISTS idx_location_destination_name_unique
    ON location(destination_id, LOWER(name))
    WHERE is_deleted = FALSE;

