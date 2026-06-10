ALTER TABLE map
ADD COLUMN IF NOT EXISTS display_order INT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'chk_map_display_order'
  ) THEN
    ALTER TABLE map
    ADD CONSTRAINT chk_map_display_order
    CHECK (display_order IS NULL OR display_order >= 0);
  END IF;
END $$;
