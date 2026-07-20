-- Keep archived as a business lifecycle state and use deleted_at for deletion.
ALTER TABLE group_trip
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_group_trip_not_deleted
    ON group_trip (group_trip_id)
    WHERE deleted_at IS NULL;
