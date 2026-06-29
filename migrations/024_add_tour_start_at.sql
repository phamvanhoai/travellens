ALTER TABLE tour
    ADD COLUMN IF NOT EXISTS start_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_tour_start_at ON tour(start_at);
