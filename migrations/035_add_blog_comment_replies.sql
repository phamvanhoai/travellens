ALTER TABLE blog_comment
    ADD COLUMN IF NOT EXISTS parent_comment_id INT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_blog_comment_parent'
    ) THEN
        ALTER TABLE blog_comment
            ADD CONSTRAINT fk_blog_comment_parent
            FOREIGN KEY (parent_comment_id)
            REFERENCES blog_comment(comment_id)
            ON UPDATE CASCADE
            ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_blog_comment_parent_comment_id
    ON blog_comment(parent_comment_id);
