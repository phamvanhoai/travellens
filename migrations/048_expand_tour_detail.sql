ALTER TABLE tour
    ADD COLUMN IF NOT EXISTS slug VARCHAR(255),
    ADD COLUMN IF NOT EXISTS short_description TEXT,
    ADD COLUMN IF NOT EXISTS duration_days INT NOT NULL DEFAULT 1 CHECK (duration_days >= 0),
    ADD COLUMN IF NOT EXISTS duration_nights INT NOT NULL DEFAULT 0 CHECK (duration_nights >= 0),
    ADD COLUMN IF NOT EXISTS start_time TIME,
    ADD COLUMN IF NOT EXISTS end_time TIME,
    ADD COLUMN IF NOT EXISTS tour_type VARCHAR(30) NOT NULL DEFAULT 'group'
        CHECK (tour_type IN ('group', 'private', 'self_guided')),
    ADD COLUMN IF NOT EXISTS languages JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS difficulty VARCHAR(30) NOT NULL DEFAULT 'easy'
        CHECK (difficulty IN ('easy', 'moderate', 'challenging', 'difficult')),
    ADD COLUMN IF NOT EXISTS minimum_participants INT NOT NULL DEFAULT 1 CHECK (minimum_participants >= 1),
    ADD COLUMN IF NOT EXISTS minimum_booking INT NOT NULL DEFAULT 1 CHECK (minimum_booking >= 1),
    ADD COLUMN IF NOT EXISTS maximum_booking INT CHECK (maximum_booking IS NULL OR maximum_booking >= 1),
    ADD COLUMN IF NOT EXISTS meeting_point TEXT,
    ADD COLUMN IF NOT EXISTS pickup_available BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS pickup_description TEXT,
    ADD COLUMN IF NOT EXISTS highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS exclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS cancellation_policy TEXT,
    ADD COLUMN IF NOT EXISTS booking_policy TEXT,
    ADD COLUMN IF NOT EXISTS additional_information TEXT,
    ADD COLUMN IF NOT EXISTS faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS video_url TEXT,
    ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    ADD COLUMN IF NOT EXISTS infant_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (infant_price >= 0);

UPDATE tour
SET slug = LOWER(TRIM(BOTH '-' FROM REGEXP_REPLACE(
    TRANSLATE(name,
      'àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ',
      'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'),
    '[^a-zA-Z0-9]+', '-', 'g'
))) || '-' || tour_id
WHERE slug IS NULL OR BTRIM(slug) = '';

ALTER TABLE tour ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_tour_slug_active
    ON tour (LOWER(slug)) WHERE deleted_at IS NULL;

ALTER TABLE tour_destination
    ADD COLUMN IF NOT EXISTS day_number INT NOT NULL DEFAULT 1 CHECK (day_number >= 1),
    ADD COLUMN IF NOT EXISTS start_time TIME,
    ADD COLUMN IF NOT EXISTS end_time TIME,
    ADD COLUMN IF NOT EXISTS estimated_minutes INT CHECK (estimated_minutes IS NULL OR estimated_minutes >= 0),
    ADD COLUMN IF NOT EXISTS activity TEXT;

