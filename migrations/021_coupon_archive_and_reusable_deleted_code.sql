ALTER TABLE coupon
    ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP;

ALTER TABLE coupon DROP CONSTRAINT IF EXISTS coupon_code_key;
ALTER TABLE coupon DROP CONSTRAINT IF EXISTS coupon_status_check;

UPDATE coupon
SET status = 'inactive'
WHERE status = 'deleted';

ALTER TABLE coupon
    ADD CONSTRAINT coupon_status_check
    CHECK (status IN ('active', 'inactive', 'expired', 'archived'));

DROP INDEX IF EXISTS uq_coupon_active_code;
CREATE UNIQUE INDEX uq_coupon_active_code
    ON coupon (UPPER(code))
    WHERE deleted_at IS NULL;
