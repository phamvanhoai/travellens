ALTER TABLE blog
    ADD COLUMN IF NOT EXISTS slug VARCHAR(255),
    ADD COLUMN IF NOT EXISTS thumbnail TEXT,
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'published',
    ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;

UPDATE blog
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(TRIM(title), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
           || '-' || blog_id
WHERE slug IS NULL OR TRIM(slug) = '';

UPDATE blog
SET published_at = COALESCE(published_at, date_created::timestamp)
WHERE status = 'published';

ALTER TABLE blog
    ALTER COLUMN slug SET NOT NULL;

ALTER TABLE blog DROP CONSTRAINT IF EXISTS blog_status_check;
ALTER TABLE blog ADD CONSTRAINT blog_status_check
    CHECK (status IN ('draft', 'published', 'archived'));

CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_slug_unique ON blog(LOWER(slug));
CREATE INDEX IF NOT EXISTS idx_blog_status_published_at
    ON blog(status, published_at DESC);
