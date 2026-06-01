ALTER TABLE booking DROP CONSTRAINT IF EXISTS booking_status_check;
ALTER TABLE booking
    ADD CONSTRAINT booking_status_check
    CHECK (status IN ('pending', 'confirmed', 'canceled', 'expired'));

ALTER TABLE booking DROP CONSTRAINT IF EXISTS booking_payment_status_check;
ALTER TABLE booking
    ADD CONSTRAINT booking_payment_status_check
    CHECK (payment_status IN ('unpaid', 'paid', 'failed', 'refunded', 'pending'));

UPDATE booking SET payment_status = 'unpaid' WHERE payment_status = 'pending';

ALTER TABLE payment
    ADD COLUMN IF NOT EXISTS payment_code VARCHAR(50),
    ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(50),
    ADD COLUMN IF NOT EXISTS sepay_transaction_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS bank_account VARCHAR(100),
    ADD COLUMN IF NOT EXISTS transfer_content TEXT,
    ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS expired_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

UPDATE payment
SET payment_code = 'LEGACY' || payment_id
WHERE payment_code IS NULL;

UPDATE payment SET payment_method = COALESCE(payment_method, 'bank_transfer');
UPDATE payment SET payment_provider = COALESCE(payment_provider, 'sepay');
UPDATE payment SET currency = COALESCE(currency, 'VND');

ALTER TABLE payment DROP CONSTRAINT IF EXISTS payment_status_check;
ALTER TABLE payment
    ADD CONSTRAINT payment_status_check
    CHECK (status IN ('pending', 'paid', 'failed', 'expired', 'refunded'));

ALTER TABLE payment
    ALTER COLUMN payment_code SET NOT NULL,
    ALTER COLUMN payment_method SET DEFAULT 'bank_transfer',
    ALTER COLUMN payment_provider SET DEFAULT 'sepay',
    ALTER COLUMN currency SET DEFAULT 'VND';

CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_payment_code_unique ON payment(payment_code);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_sepay_transaction_unique
    ON payment(sepay_transaction_id)
    WHERE sepay_transaction_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payment_booking_id ON payment(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_status_expired_at ON payment(status, expired_at);

CREATE TABLE IF NOT EXISTS sepay_webhook_log (
    sepay_webhook_log_id SERIAL PRIMARY KEY,
    sepay_transaction_id VARCHAR(100) NOT NULL UNIQUE,
    payment_id INT REFERENCES payment(payment_id) ON DELETE SET NULL,
    payment_code VARCHAR(50),
    transfer_amount NUMERIC(12,2),
    transfer_type VARCHAR(50),
    raw_payload JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'received',
    message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sepay_webhook_log_payment_code ON sepay_webhook_log(payment_code);
CREATE INDEX IF NOT EXISTS idx_sepay_webhook_log_created_at ON sepay_webhook_log(created_at);
