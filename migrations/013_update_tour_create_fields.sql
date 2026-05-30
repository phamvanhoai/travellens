ALTER TABLE tour
    ALTER COLUMN name TYPE VARCHAR(255),
    ADD COLUMN IF NOT EXISTS thumbnail TEXT;

ALTER TABLE tour
    DROP CONSTRAINT IF EXISTS chk_tour_status;

ALTER TABLE tour
    ADD CONSTRAINT chk_tour_status
    CHECK (status IN ('active', 'inactive', 'draft'));
