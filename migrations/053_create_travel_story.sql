CREATE TABLE IF NOT EXISTS travel_story (
    story_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    media_url TEXT NOT NULL,
    media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('image', 'video')),
    caption VARCHAR(1000),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleted')),
    expires_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_travel_story_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS travel_story_view (
    story_id INT NOT NULL,
    viewer_id INT NOT NULL,
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_travel_story_view PRIMARY KEY (story_id, viewer_id),
    CONSTRAINT fk_travel_story_view_story FOREIGN KEY (story_id)
        REFERENCES travel_story(story_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_travel_story_view_user FOREIGN KEY (viewer_id)
        REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_travel_story_active_feed
    ON travel_story(created_at DESC) WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_travel_story_user_created
    ON travel_story(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_travel_story_expires_at ON travel_story(expires_at);

