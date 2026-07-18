CREATE TABLE IF NOT EXISTS user_block (
    blocker_id INT NOT NULL,
    blocked_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blocker_id, blocked_id),
    CONSTRAINT fk_user_block_blocker
        FOREIGN KEY (blocker_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_block_blocked
        FOREIGN KEY (blocked_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT chk_user_block_not_self
        CHECK (blocker_id <> blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_user_block_blocked_id ON user_block(blocked_id);
