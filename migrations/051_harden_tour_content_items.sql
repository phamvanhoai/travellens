ALTER TABLE tour_content_item
    ADD COLUMN IF NOT EXISTS normalized_content TEXT;

UPDATE tour_content_item
SET normalized_content = LOWER(REGEXP_REPLACE(BTRIM(content), '\s+', ' ', 'g'))
WHERE normalized_content IS NULL;

ALTER TABLE tour_content_item ALTER COLUMN normalized_content SET NOT NULL;

DROP INDEX IF EXISTS uq_tour_content_item_type_content_active;
CREATE UNIQUE INDEX IF NOT EXISTS uq_tour_content_item_type_normalized_active
    ON tour_content_item(type, normalized_content) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS tour_content_item_link (
    tour_id INT NOT NULL,
    content_item_id INT,
    source_content_item_id INT,
    content_type VARCHAR(40) NOT NULL,
    snapshot_content TEXT NOT NULL,
    sort_order INT NOT NULL CHECK (sort_order >= 1),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tour_content_item_link PRIMARY KEY (tour_id, sort_order),
    CONSTRAINT uq_tour_content_item_link_item UNIQUE (tour_id, content_item_id),
    CONSTRAINT fk_tour_content_item_link_tour FOREIGN KEY (tour_id)
        REFERENCES tour(tour_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_tour_content_item_link_item FOREIGN KEY (content_item_id)
        REFERENCES tour_content_item(content_item_id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_tour_content_item_link_source FOREIGN KEY (source_content_item_id)
        REFERENCES tour_content_item(content_item_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tour_content_item_link_source
    ON tour_content_item_link(source_content_item_id);

