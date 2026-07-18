-- Simplify travel-feed report moderation and support restoring admin-deleted posts.

UPDATE travel_post_report
SET status = 'pending',
    reviewed_by = NULL,
    reviewed_at = NULL
WHERE status = 'reviewed';

ALTER TABLE travel_post_report
    DROP CONSTRAINT IF EXISTS chk_travel_post_report_status;

ALTER TABLE travel_post_report
    ADD CONSTRAINT chk_travel_post_report_status
    CHECK (status IN ('pending', 'dismissed', 'resolved'));

ALTER TABLE travel_post
    ADD COLUMN IF NOT EXISTS previous_status VARCHAR(30),
    ADD COLUMN IF NOT EXISTS deleted_by INT,
    ADD COLUMN IF NOT EXISTS restored_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS restored_by INT;

ALTER TABLE travel_post
    DROP CONSTRAINT IF EXISTS chk_travel_post_previous_status;

ALTER TABLE travel_post
    ADD CONSTRAINT chk_travel_post_previous_status
    CHECK (previous_status IS NULL OR previous_status IN ('draft', 'published', 'hidden'));

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_travel_post_deleted_by'
    ) THEN
        ALTER TABLE travel_post
            ADD CONSTRAINT fk_travel_post_deleted_by
            FOREIGN KEY (deleted_by) REFERENCES users(user_id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_travel_post_restored_by'
    ) THEN
        ALTER TABLE travel_post
            ADD CONSTRAINT fk_travel_post_restored_by
            FOREIGN KEY (restored_by) REFERENCES users(user_id) ON DELETE SET NULL;
    END IF;
END $$;
