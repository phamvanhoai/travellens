CREATE TABLE IF NOT EXISTS coupon (
    coupon_id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(12,2) NOT NULL CHECK (discount_value >= 0),
    max_discount_amount NUMERIC(12,2) CHECK (max_discount_amount IS NULL OR max_discount_amount >= 0),
    min_order_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (min_order_amount >= 0),
    usage_limit INT CHECK (usage_limit IS NULL OR usage_limit > 0),
    used_count INT NOT NULL DEFAULT 0 CHECK (used_count >= 0),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'deleted')),
    created_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

ALTER TABLE coupon
    ADD COLUMN IF NOT EXISTS start_date DATE,
    ADD COLUMN IF NOT EXISTS end_date DATE,
    ADD COLUMN IF NOT EXISTS created_by INT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

UPDATE coupon SET discount_type = 'percentage' WHERE discount_type = 'percent';

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'coupon' AND column_name = 'starts_at'
    ) THEN
        EXECUTE 'UPDATE coupon SET start_date = starts_at::date WHERE start_date IS NULL';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'coupon' AND column_name = 'expires_at'
    ) THEN
        EXECUTE 'UPDATE coupon SET end_date = expires_at::date WHERE end_date IS NULL';
    END IF;
END $$;

ALTER TABLE coupon DROP CONSTRAINT IF EXISTS coupon_discount_type_check;
ALTER TABLE coupon ADD CONSTRAINT coupon_discount_type_check CHECK (discount_type IN ('percentage', 'fixed'));

ALTER TABLE coupon DROP CONSTRAINT IF EXISTS coupon_usage_limit_check;
ALTER TABLE coupon ADD CONSTRAINT coupon_usage_limit_check CHECK (usage_limit IS NULL OR usage_limit > 0);

ALTER TABLE coupon DROP CONSTRAINT IF EXISTS coupon_status_check;
ALTER TABLE coupon ADD CONSTRAINT coupon_status_check CHECK (status IN ('active', 'inactive', 'expired', 'deleted'));

ALTER TABLE coupon DROP CONSTRAINT IF EXISTS fk_coupon_created_by;
ALTER TABLE coupon
    ADD CONSTRAINT fk_coupon_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(user_id)
    ON DELETE SET NULL;

ALTER TABLE coupon
    DROP COLUMN IF EXISTS starts_at,
    DROP COLUMN IF EXISTS expires_at;

ALTER TABLE booking
    ADD COLUMN IF NOT EXISTS coupon_id INT,
    ADD COLUMN IF NOT EXISTS original_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (original_amount >= 0),
    ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    ADD COLUMN IF NOT EXISTS final_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (final_amount >= 0);

ALTER TABLE booking DROP CONSTRAINT IF EXISTS fk_booking_coupon;
ALTER TABLE booking
    ADD CONSTRAINT fk_booking_coupon
    FOREIGN KEY (coupon_id)
    REFERENCES coupon(coupon_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_booking_coupon_id ON booking(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_code ON coupon(code);
CREATE INDEX IF NOT EXISTS idx_coupon_status ON coupon(status);
CREATE INDEX IF NOT EXISTS idx_coupon_deleted_at ON coupon(deleted_at);
