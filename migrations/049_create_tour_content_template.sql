CREATE TABLE IF NOT EXISTS tour_content_template (
    content_template_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
    requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    exclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    booking_policy TEXT,
    cancellation_policy TEXT,
    additional_information TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_tour_content_template_name_active
    ON tour_content_template (LOWER(name)) WHERE deleted_at IS NULL;

ALTER TABLE tour
    ADD COLUMN IF NOT EXISTS content_template_id INT;

ALTER TABLE tour
    DROP CONSTRAINT IF EXISTS fk_tour_content_template;

ALTER TABLE tour
    ADD CONSTRAINT fk_tour_content_template
    FOREIGN KEY (content_template_id)
    REFERENCES tour_content_template(content_template_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_tour_content_template_id ON tour(content_template_id);

