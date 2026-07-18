-- Migration 042 created an inline check whose PostgreSQL-generated name is
-- group_trip_invite_status_check. Remove both possible names before installing
-- the canonical constraint that includes the declined state.
ALTER TABLE group_trip_invite
    DROP CONSTRAINT IF EXISTS group_trip_invite_status_check,
    DROP CONSTRAINT IF EXISTS chk_group_trip_invite_status;

ALTER TABLE group_trip_invite
    ADD CONSTRAINT chk_group_trip_invite_status
    CHECK (status IN ('pending', 'accepted', 'expired', 'canceled', 'declined'));
