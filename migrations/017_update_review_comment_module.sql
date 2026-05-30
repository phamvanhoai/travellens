ALTER TABLE review
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'approved',
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

ALTER TABLE review
    DROP CONSTRAINT IF EXISTS chk_review_status;

ALTER TABLE review
    ADD CONSTRAINT chk_review_status
    CHECK (status IN ('pending', 'approved', 'rejected'));

CREATE INDEX IF NOT EXISTS idx_review_location_id
    ON review(location_id);

CREATE INDEX IF NOT EXISTS idx_review_user_id
    ON review(user_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_review_user_location_unique
    ON review(user_id, location_id)
    WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_review_deleted_at
    ON review(deleted_at);
