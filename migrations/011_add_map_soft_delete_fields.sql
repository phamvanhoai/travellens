ALTER TABLE map
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

ALTER TABLE map
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE map
SET is_deleted = FALSE
WHERE is_deleted IS NULL;

CREATE INDEX IF NOT EXISTS idx_map_deleted_at ON map(deleted_at);
CREATE INDEX IF NOT EXISTS idx_map_is_deleted ON map(is_deleted);
