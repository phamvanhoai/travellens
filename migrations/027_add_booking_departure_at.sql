ALTER TABLE booking
    ADD COLUMN IF NOT EXISTS departure_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_booking_departure_at ON booking(departure_at);
CREATE INDEX IF NOT EXISTS idx_booking_tour_departure_at
    ON booking(tour_id, departure_at);
