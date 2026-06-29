CREATE TABLE IF NOT EXISTS booking_status_history (
    booking_status_history_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    from_status VARCHAR(50),
    to_status VARCHAR(50),
    from_payment_status VARCHAR(50),
    to_payment_status VARCHAR(50),
    reason TEXT,
    changed_by INT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_status_history_booking
        FOREIGN KEY (booking_id)
        REFERENCES booking(booking_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_booking_status_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_booking_status_history_booking_id
    ON booking_status_history(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_status_history_created_at
    ON booking_status_history(created_at);
CREATE INDEX IF NOT EXISTS idx_booking_status_history_action
    ON booking_status_history(action);
