CREATE TABLE IF NOT EXISTS blog_category (
    blog_category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_blog_category_name UNIQUE (name)
);

ALTER TABLE blog
    ADD COLUMN IF NOT EXISTS blog_category_id INT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_blog_category'
    ) THEN
        ALTER TABLE blog
            ADD CONSTRAINT fk_blog_category
            FOREIGN KEY (blog_category_id)
            REFERENCES blog_category(blog_category_id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_blog_blog_category_id
    ON blog(blog_category_id);
