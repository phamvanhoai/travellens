ALTER TABLE tour
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

ALTER TABLE tour
    ALTER COLUMN destination_id DROP NOT NULL;

ALTER TABLE tour
    DROP CONSTRAINT IF EXISTS chk_tour_status;

ALTER TABLE tour
    ADD CONSTRAINT chk_tour_status
    CHECK (status IN ('active', 'inactive', 'draft', 'deleted'));

CREATE TABLE IF NOT EXISTS tour_destination (
    tour_destination_id SERIAL PRIMARY KEY,
    tour_id INT NOT NULL,
    destination_id INT NOT NULL,
    order_index INT NOT NULL CHECK (order_index >= 1),
    estimated_time VARCHAR(100),
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tour_destination_tour
        FOREIGN KEY (tour_id)
        REFERENCES tour(tour_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_tour_destination_destination
        FOREIGN KEY (destination_id)
        REFERENCES travel_destination(destination_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT uq_tour_destination_destination
        UNIQUE (tour_id, destination_id),
    CONSTRAINT uq_tour_destination_order
        UNIQUE (tour_id, order_index)
);

INSERT INTO tour_destination (tour_id, destination_id, order_index)
SELECT t.tour_id, t.destination_id, 1
FROM tour t
WHERE t.destination_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM tour_destination td
      WHERE td.tour_id = t.tour_id
        AND td.destination_id = t.destination_id
  );

CREATE INDEX IF NOT EXISTS idx_tour_deleted_at
    ON tour(deleted_at);

CREATE INDEX IF NOT EXISTS idx_tour_destination_tour_id
    ON tour_destination(tour_id);

CREATE INDEX IF NOT EXISTS idx_tour_destination_destination_id
    ON tour_destination(destination_id);
