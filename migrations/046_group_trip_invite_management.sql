-- Add an explicit customer-declined state while preserving all existing invites.
ALTER TABLE group_trip_invite
    ADD COLUMN IF NOT EXISTS declined_at TIMESTAMP;

ALTER TABLE group_trip_invite
    DROP CONSTRAINT IF EXISTS group_trip_invite_status_check,
    DROP CONSTRAINT IF EXISTS chk_group_trip_invite_status;

ALTER TABLE group_trip_invite
    ADD CONSTRAINT chk_group_trip_invite_status
    CHECK (status IN ('pending', 'accepted', 'expired', 'canceled', 'declined'));

CREATE INDEX IF NOT EXISTS idx_group_trip_invite_trip_status
    ON group_trip_invite(group_trip_id, status, created_at DESC);
