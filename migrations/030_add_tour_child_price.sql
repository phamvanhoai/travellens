ALTER TABLE tour
ADD COLUMN IF NOT EXISTS child_price NUMERIC(12,2);

UPDATE tour
SET child_price = ROUND(price * 0.65, 2)
WHERE child_price IS NULL;

ALTER TABLE tour
ALTER COLUMN child_price SET DEFAULT 0,
ALTER COLUMN child_price SET NOT NULL;

ALTER TABLE tour DROP CONSTRAINT IF EXISTS tour_child_price_check;
ALTER TABLE tour
ADD CONSTRAINT tour_child_price_check CHECK (child_price >= 0);
