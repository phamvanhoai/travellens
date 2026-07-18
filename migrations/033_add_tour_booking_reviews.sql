ALTER TABLE review
    ADD COLUMN IF NOT EXISTS booking_id INTEGER,
    ADD COLUMN IF NOT EXISTS tour_id INTEGER;

ALTER TABLE review
    ALTER COLUMN location_id DROP NOT NULL;

ALTER TABLE review DROP CONSTRAINT IF EXISTS fk_review_booking;
ALTER TABLE review
    ADD CONSTRAINT fk_review_booking
    FOREIGN KEY (booking_id)
    REFERENCES booking(booking_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE review DROP CONSTRAINT IF EXISTS fk_review_tour;
ALTER TABLE review
    ADD CONSTRAINT fk_review_tour
    FOREIGN KEY (tour_id)
    REFERENCES tour(tour_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS uq_review_active_booking
    ON review(booking_id)
    WHERE booking_id IS NOT NULL
      AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_review_booking_id
    ON review(booking_id);

CREATE INDEX IF NOT EXISTS idx_review_tour_id
    ON review(tour_id);
