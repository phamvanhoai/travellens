ALTER TABLE booking
    ADD COLUMN IF NOT EXISTS request_id UUID,
    ADD COLUMN IF NOT EXISTS policy_accepted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS policy_snapshot JSONB;

CREATE UNIQUE INDEX IF NOT EXISTS uq_booking_user_request_id
    ON booking(user_id, request_id)
    WHERE request_id IS NOT NULL;

