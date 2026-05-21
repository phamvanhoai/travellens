CREATE TABLE IF NOT EXISTS destination_category (
    destination_category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tour_category (
    tour_category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_destination_category_name_unique
    ON destination_category(name);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tour_category_name_unique
    ON tour_category(name);

DO $$
BEGIN
    IF to_regclass('public.category') IS NOT NULL THEN
        INSERT INTO destination_category (name, description)
        SELECT name, description FROM category
        ON CONFLICT DO NOTHING;

        INSERT INTO tour_category (name, description)
        SELECT name, description FROM category
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

ALTER TABLE travel_destination
    ADD COLUMN IF NOT EXISTS destination_category_id INT;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'travel_destination'
          AND column_name = 'category_id'
    ) THEN
        EXECUTE 'UPDATE travel_destination SET destination_category_id = category_id WHERE destination_category_id IS NULL';
    END IF;
END $$;

ALTER TABLE tour
    ADD COLUMN IF NOT EXISTS tour_category_id INT;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'tour'
          AND column_name = 'category_id'
    ) THEN
        EXECUTE 'UPDATE tour SET tour_category_id = category_id WHERE tour_category_id IS NULL';
    END IF;
END $$;

ALTER TABLE travel_destination
    DROP CONSTRAINT IF EXISTS fk_travel_destination_category,
    DROP CONSTRAINT IF EXISTS fk_travel_destination_destination_category;

ALTER TABLE travel_destination
    ADD CONSTRAINT fk_travel_destination_destination_category
    FOREIGN KEY (destination_category_id)
    REFERENCES destination_category(destination_category_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;

ALTER TABLE tour
    DROP CONSTRAINT IF EXISTS fk_tour_category,
    DROP CONSTRAINT IF EXISTS fk_tour_tour_category;

ALTER TABLE tour
    ADD CONSTRAINT fk_tour_tour_category
    FOREIGN KEY (tour_category_id)
    REFERENCES tour_category(tour_category_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;

ALTER TABLE location
    DROP CONSTRAINT IF EXISTS fk_location_category;

ALTER TABLE travel_destination
    DROP COLUMN IF EXISTS category_id;

ALTER TABLE tour
    DROP COLUMN IF EXISTS category_id;

ALTER TABLE location
    DROP COLUMN IF EXISTS category_id;

CREATE INDEX IF NOT EXISTS idx_travel_destination_destination_category_id
    ON travel_destination(destination_category_id);

CREATE INDEX IF NOT EXISTS idx_tour_tour_category_id
    ON tour(tour_category_id);

DROP INDEX IF EXISTS idx_travel_destination_category_id;
DROP INDEX IF EXISTS idx_tour_category_id;
DROP INDEX IF EXISTS idx_location_category_id;

DROP TABLE IF EXISTS category CASCADE;
