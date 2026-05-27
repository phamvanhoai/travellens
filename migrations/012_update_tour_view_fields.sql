ALTER TABLE tour
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'active',
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE tour
    DROP CONSTRAINT IF EXISTS chk_tour_status;

ALTER TABLE tour
    ADD CONSTRAINT chk_tour_status
    CHECK (status IN ('active', 'inactive'));

CREATE INDEX IF NOT EXISTS idx_tour_status
    ON tour(status);

CREATE INDEX IF NOT EXISTS idx_tour_created_at
    ON tour(created_at);
