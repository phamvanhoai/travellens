ALTER TABLE booking DROP CONSTRAINT IF EXISTS booking_status_check;

ALTER TABLE booking
    ADD CONSTRAINT booking_status_check
    CHECK (status IN (
        'pending',
        'waiting_manual_confirmation',
        'confirmed',
        'cancel_pending',
        'canceled',
        'expired'
    ));
