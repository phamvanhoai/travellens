CREATE TABLE IF NOT EXISTS blog_comment (
    comment_id SERIAL PRIMARY KEY,
    blog_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_comment_id INT,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'approved',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_blog_comment_blog
        FOREIGN KEY (blog_id)
        REFERENCES blog(blog_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_blog_comment_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_blog_comment_parent
        FOREIGN KEY (parent_comment_id)
        REFERENCES blog_comment(comment_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT chk_blog_comment_status
        CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX IF NOT EXISTS idx_blog_comment_blog_id
    ON blog_comment(blog_id);

CREATE INDEX IF NOT EXISTS idx_blog_comment_user_id
    ON blog_comment(user_id);

CREATE INDEX IF NOT EXISTS idx_blog_comment_parent_comment_id
    ON blog_comment(parent_comment_id);

CREATE INDEX IF NOT EXISTS idx_blog_comment_status
    ON blog_comment(status);

CREATE INDEX IF NOT EXISTS idx_blog_comment_deleted_at
    ON blog_comment(deleted_at);
