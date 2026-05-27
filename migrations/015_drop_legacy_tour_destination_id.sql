ALTER TABLE tour
    DROP CONSTRAINT IF EXISTS fk_tour_destination;

DROP INDEX IF EXISTS idx_tour_destination_id;

ALTER TABLE tour
    DROP COLUMN IF EXISTS destination_id;
