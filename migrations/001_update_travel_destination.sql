ALTER TABLE travel_destination
    ADD COLUMN IF NOT EXISTS thumbnail TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS idx_travel_destination_name_unique
    ON travel_destination(name)
    WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_travel_destination_deleted_at
    ON travel_destination(deleted_at);

