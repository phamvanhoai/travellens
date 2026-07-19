ALTER TABLE booking
    ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20),
    ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;

UPDATE booking
SET created_at = COALESCE(date_created::timestamp, CURRENT_TIMESTAMP)
WHERE created_at IS NULL;

ALTER TABLE booking ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE booking ALTER COLUMN created_at SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_booking_created_at ON booking(created_at);
CREATE INDEX IF NOT EXISTS idx_booking_tour_departure_status
    ON booking(tour_id, departure_at, status);

