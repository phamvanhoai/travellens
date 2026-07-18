CREATE TABLE IF NOT EXISTS travel_post (
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT,
    destination_id INT,
    location_id INT,
    status VARCHAR(30) NOT NULL DEFAULT 'published',
    visibility VARCHAR(30) NOT NULL DEFAULT 'public',
    like_count INT NOT NULL DEFAULT 0,
    comment_count INT NOT NULL DEFAULT 0,
    report_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_travel_post_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_travel_post_destination
        FOREIGN KEY (destination_id)
        REFERENCES travel_destination(destination_id)
        ON DELETE SET NULL,
    CONSTRAINT fk_travel_post_location
        FOREIGN KEY (location_id)
        REFERENCES location(location_id)
        ON DELETE SET NULL,
    CONSTRAINT chk_travel_post_status
        CHECK (status IN ('draft', 'published', 'hidden', 'deleted')),
    CONSTRAINT chk_travel_post_visibility
        CHECK (visibility IN ('public', 'private')),
    CONSTRAINT chk_travel_post_counts
        CHECK (like_count >= 0 AND comment_count >= 0 AND report_count >= 0)
);

CREATE TABLE IF NOT EXISTS travel_post_photo (
    photo_id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_travel_post_photo_post
        FOREIGN KEY (post_id)
        REFERENCES travel_post(post_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS travel_post_like (
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, user_id),
    CONSTRAINT fk_travel_post_like_post
        FOREIGN KEY (post_id)
        REFERENCES travel_post(post_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_travel_post_like_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS travel_post_comment (
    comment_id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_comment_id INT,
    content TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'published',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_travel_post_comment_post
        FOREIGN KEY (post_id)
        REFERENCES travel_post(post_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_travel_post_comment_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_travel_post_comment_parent
        FOREIGN KEY (parent_comment_id)
        REFERENCES travel_post_comment(comment_id)
        ON DELETE CASCADE,
    CONSTRAINT chk_travel_post_comment_status
        CHECK (status IN ('published', 'hidden', 'deleted'))
);

CREATE TABLE IF NOT EXISTS travel_post_report (
    report_id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    reviewed_by INT,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_travel_post_report_post
        FOREIGN KEY (post_id)
        REFERENCES travel_post(post_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_travel_post_report_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_travel_post_report_reviewed_by
        FOREIGN KEY (reviewed_by)
        REFERENCES users(user_id)
        ON DELETE SET NULL,
    CONSTRAINT chk_travel_post_report_status
        CHECK (status IN ('pending', 'reviewed', 'dismissed', 'resolved')),
    CONSTRAINT uq_travel_post_report_user_post
        UNIQUE (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_travel_post_user_id ON travel_post(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_post_status_created_at ON travel_post(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_travel_post_visibility ON travel_post(visibility);
CREATE INDEX IF NOT EXISTS idx_travel_post_destination_id ON travel_post(destination_id);
CREATE INDEX IF NOT EXISTS idx_travel_post_location_id ON travel_post(location_id);
CREATE INDEX IF NOT EXISTS idx_travel_post_deleted_at ON travel_post(deleted_at);
CREATE INDEX IF NOT EXISTS idx_travel_post_photo_post_id ON travel_post_photo(post_id);
CREATE INDEX IF NOT EXISTS idx_travel_post_photo_deleted_at ON travel_post_photo(deleted_at);
CREATE INDEX IF NOT EXISTS idx_travel_post_like_user_id ON travel_post_like(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_post_comment_post_id ON travel_post_comment(post_id);
CREATE INDEX IF NOT EXISTS idx_travel_post_comment_user_id ON travel_post_comment(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_post_comment_parent_id ON travel_post_comment(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_travel_post_comment_deleted_at ON travel_post_comment(deleted_at);
CREATE INDEX IF NOT EXISTS idx_travel_post_report_post_id ON travel_post_report(post_id);
CREATE INDEX IF NOT EXISTS idx_travel_post_report_user_id ON travel_post_report(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_post_report_status ON travel_post_report(status);
