CREATE TABLE IF NOT EXISTS blog_blog_category (
    blog_id INT NOT NULL,
    blog_category_id INT NOT NULL,
    PRIMARY KEY (blog_id, blog_category_id),
    CONSTRAINT fk_blog_blog_category_blog
        FOREIGN KEY (blog_id)
        REFERENCES blog(blog_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_blog_blog_category_category
        FOREIGN KEY (blog_category_id)
        REFERENCES blog_category(blog_category_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'blog'
          AND column_name = 'blog_category_id'
    ) THEN
        INSERT INTO blog_blog_category (blog_id, blog_category_id)
        SELECT blog_id, blog_category_id
        FROM blog
        WHERE blog_category_id IS NOT NULL
        ON CONFLICT DO NOTHING;

        ALTER TABLE blog DROP CONSTRAINT IF EXISTS fk_blog_category;
        DROP INDEX IF EXISTS idx_blog_blog_category_id;
        ALTER TABLE blog DROP COLUMN blog_category_id;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_blog_blog_category_category_id
    ON blog_blog_category(blog_category_id);
