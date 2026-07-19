CREATE TABLE IF NOT EXISTS tour_content_item (
    content_item_id SERIAL PRIMARY KEY,
    type VARCHAR(40) NOT NULL CHECK (type IN (
        'highlight', 'requirement', 'inclusion', 'exclusion',
        'booking_policy', 'cancellation_policy', 'additional_information'
    )),
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_tour_content_item_type_content_active
    ON tour_content_item (type, LOWER(content)) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tour_content_item_type_status
    ON tour_content_item(type, status) WHERE deleted_at IS NULL;

ALTER TABLE tour DROP CONSTRAINT IF EXISTS fk_tour_content_template;
DROP INDEX IF EXISTS idx_tour_content_template_id;
ALTER TABLE tour DROP COLUMN IF EXISTS content_template_id;
DROP TABLE IF EXISTS tour_content_template;

