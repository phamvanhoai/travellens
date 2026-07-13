ALTER TABLE travel_post
ADD COLUMN IF NOT EXISTS share_count INT NOT NULL DEFAULT 0;

ALTER TABLE travel_post
DROP CONSTRAINT IF EXISTS chk_travel_post_counts;

ALTER TABLE travel_post
ADD CONSTRAINT chk_travel_post_counts
CHECK (
  like_count >= 0
  AND comment_count >= 0
  AND report_count >= 0
  AND share_count >= 0
);

CREATE TABLE IF NOT EXISTS travel_post_share (
    share_id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    platform VARCHAR(30) NOT NULL,
    counted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_travel_post_share_post
        FOREIGN KEY (post_id)
        REFERENCES travel_post(post_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_travel_post_share_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT chk_travel_post_share_platform
        CHECK (platform IN ('facebook', 'zalo', 'copy_link', 'other'))
);

CREATE INDEX IF NOT EXISTS idx_travel_post_share_post_id ON travel_post_share(post_id);
CREATE INDEX IF NOT EXISTS idx_travel_post_share_user_id ON travel_post_share(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_post_share_platform ON travel_post_share(platform);
CREATE INDEX IF NOT EXISTS idx_travel_post_share_recent
ON travel_post_share(post_id, user_id, platform, created_at DESC);
