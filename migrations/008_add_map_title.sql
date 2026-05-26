ALTER TABLE map
ADD COLUMN IF NOT EXISTS title VARCHAR(255);

UPDATE map
SET title = COALESCE(NULLIF(description, ''), CONCAT('Map #', map_id))
WHERE title IS NULL OR title = '';

ALTER TABLE map
ALTER COLUMN title SET NOT NULL;
