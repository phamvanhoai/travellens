CREATE TABLE IF NOT EXISTS media_file (
    media_id SERIAL PRIMARY KEY,
    uploaded_by INT,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL UNIQUE,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL CHECK (file_size >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_media_file_uploaded_by
        FOREIGN KEY (uploaded_by)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_media_file_created_at ON media_file(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_file_deleted_at ON media_file(deleted_at);
CREATE INDEX IF NOT EXISTS idx_media_file_uploaded_by ON media_file(uploaded_by);
