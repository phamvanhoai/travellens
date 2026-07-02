CREATE TABLE IF NOT EXISTS view360_hotspot (
    hotspot_id SERIAL PRIMARY KEY,
    view360_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info',
    title VARCHAR(255),
    description TEXT,
    yaw NUMERIC(10, 4) NOT NULL,
    pitch NUMERIC(10, 4) NOT NULL,
    target_view360_id INTEGER,
    target_url TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_view360_hotspot_view360
        FOREIGN KEY (view360_id)
        REFERENCES view360(view_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_view360_hotspot_target_view360
        FOREIGN KEY (target_view360_id)
        REFERENCES view360(view_id)
        ON DELETE SET NULL,
    CONSTRAINT view360_hotspot_type_check
        CHECK (type IN ('info', 'navigation', 'link', 'location'))
);

CREATE INDEX IF NOT EXISTS idx_view360_hotspot_view360_id
    ON view360_hotspot(view360_id);

CREATE INDEX IF NOT EXISTS idx_view360_hotspot_target_view360_id
    ON view360_hotspot(target_view360_id);

CREATE INDEX IF NOT EXISTS idx_view360_hotspot_deleted_at
    ON view360_hotspot(deleted_at);
