CREATE TABLE IF NOT EXISTS refund_request (
    refund_request_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_id INT NOT NULL,
    requested_by INT,
    reason TEXT,
    refund_amount NUMERIC(12,2) NOT NULL CHECK (refund_amount >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    staff_note TEXT,
    completed_by INT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refund_request_booking
        FOREIGN KEY (booking_id)
        REFERENCES booking(booking_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_refund_request_payment
        FOREIGN KEY (payment_id)
        REFERENCES payment(payment_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_refund_request_requested_by
        FOREIGN KEY (requested_by)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT fk_refund_request_completed_by
        FOREIGN KEY (completed_by)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_refund_request_pending_booking
    ON refund_request(booking_id)
    WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_refund_request_status ON refund_request(status);
CREATE INDEX IF NOT EXISTS idx_refund_request_payment_id ON refund_request(payment_id);
CREATE INDEX IF NOT EXISTS idx_refund_request_requested_by ON refund_request(requested_by);
