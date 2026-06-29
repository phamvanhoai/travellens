ALTER TABLE refund_request
    ADD COLUMN IF NOT EXISTS reviewed_by INT,
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;

ALTER TABLE refund_request DROP CONSTRAINT IF EXISTS refund_request_status_check;
ALTER TABLE refund_request
    ADD CONSTRAINT refund_request_status_check
    CHECK (status IN ('pending', 'approved', 'rejected', 'completed'));

ALTER TABLE refund_request DROP CONSTRAINT IF EXISTS fk_refund_request_reviewed_by;
ALTER TABLE refund_request
    ADD CONSTRAINT fk_refund_request_reviewed_by
    FOREIGN KEY (reviewed_by)
    REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL;

DROP INDEX IF EXISTS idx_refund_request_pending_booking;
CREATE UNIQUE INDEX IF NOT EXISTS idx_refund_request_active_booking
    ON refund_request(booking_id)
    WHERE status IN ('pending', 'approved');

CREATE INDEX IF NOT EXISTS idx_refund_request_reviewed_by ON refund_request(reviewed_by);
