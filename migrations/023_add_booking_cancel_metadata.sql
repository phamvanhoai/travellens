ALTER TABLE booking
    ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS canceled_by INT,
    ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

ALTER TABLE booking DROP CONSTRAINT IF EXISTS fk_booking_canceled_by;
ALTER TABLE booking
    ADD CONSTRAINT fk_booking_canceled_by
    FOREIGN KEY (canceled_by)
    REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_booking_canceled_at ON booking(canceled_at);
CREATE INDEX IF NOT EXISTS idx_booking_canceled_by ON booking(canceled_by);
