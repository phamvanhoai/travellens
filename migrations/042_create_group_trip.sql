CREATE TABLE IF NOT EXISTS group_trip (
    group_trip_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    visibility VARCHAR(20) NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'private')),
    leader_id INT NOT NULL,
    created_by INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_group_trip_booking
        FOREIGN KEY (booking_id)
        REFERENCES booking(booking_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_group_trip_leader
        FOREIGN KEY (leader_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_group_trip_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT uq_group_trip_booking
        UNIQUE (booking_id)
);

CREATE TABLE IF NOT EXISTS group_trip_member (
    group_trip_member_id SERIAL PRIMARY KEY,
    group_trip_id INT NOT NULL,
    user_id INT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('leader', 'member')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'left', 'removed')),
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    removed_at TIMESTAMP,
    removed_by INT,
    CONSTRAINT fk_group_trip_member_trip
        FOREIGN KEY (group_trip_id)
        REFERENCES group_trip(group_trip_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_group_trip_member_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_group_trip_member_removed_by
        FOREIGN KEY (removed_by)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT uq_group_trip_member_user
        UNIQUE (group_trip_id, user_id)
);

CREATE TABLE IF NOT EXISTS group_trip_invite (
    group_trip_invite_id SERIAL PRIMARY KEY,
    group_trip_id INT NOT NULL,
    invited_user_id INT NOT NULL,
    invited_email VARCHAR(255) NOT NULL,
    invited_by INT NOT NULL,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'canceled')),
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP,
    canceled_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_group_trip_invite_trip
        FOREIGN KEY (group_trip_id)
        REFERENCES group_trip(group_trip_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_group_trip_invite_user
        FOREIGN KEY (invited_user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_group_trip_invite_by
        FOREIGN KEY (invited_by)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_group_trip_active_leader
    ON group_trip_member (group_trip_id)
    WHERE role = 'leader' AND status = 'active';

CREATE UNIQUE INDEX IF NOT EXISTS uq_group_trip_pending_invite
    ON group_trip_invite (group_trip_id, invited_user_id)
    WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_group_trip_member_user_status
    ON group_trip_member (user_id, status);

CREATE INDEX IF NOT EXISTS idx_group_trip_invite_user_status
    ON group_trip_invite (invited_user_id, status);
