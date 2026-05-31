CREATE TABLE IF NOT EXISTS review_photo (
    photo_id SERIAL PRIMARY KEY,
    review_id INT NOT NULL,
    photo_url TEXT NOT NULL,
    original_name VARCHAR(255),
    mime_type VARCHAR(100),
    file_size INT CHECK (file_size IS NULL OR file_size >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_review_photo_review
        FOREIGN KEY (review_id)
        REFERENCES review(review_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_review_photo_review_id
    ON review_photo(review_id);

CREATE INDEX IF NOT EXISTS idx_review_photo_deleted_at
    ON review_photo(deleted_at);
