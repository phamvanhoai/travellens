CREATE TABLE IF NOT EXISTS tour_departure (
    tour_departure_id SERIAL PRIMARY KEY,
    tour_id INTEGER NOT NULL REFERENCES tour(tour_id) ON DELETE RESTRICT,
    departure_at TIMESTAMPTZ NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    price NUMERIC(14,2) NOT NULL CHECK (price >= 0),
    child_price NUMERIC(14,2) NOT NULL CHECK (child_price >= 0),
    infant_price NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (infant_price >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    booking_open_at TIMESTAMPTZ,
    booking_close_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'open', 'closed', 'sold_out', 'cancelled', 'departed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT uq_tour_departure_time UNIQUE (tour_id, departure_at),
    CONSTRAINT chk_tour_departure_booking_window CHECK (
        booking_open_at IS NULL OR booking_close_at IS NULL OR booking_open_at < booking_close_at
    ),
    CONSTRAINT chk_tour_departure_close_before_departure CHECK (
        booking_close_at IS NULL OR booking_close_at <= departure_at
    )
);

ALTER TABLE booking ADD COLUMN IF NOT EXISTS tour_departure_id INTEGER;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_booking_tour_departure') THEN
        ALTER TABLE booking ADD CONSTRAINT fk_booking_tour_departure
            FOREIGN KEY (tour_departure_id) REFERENCES tour_departure(tour_departure_id) ON DELETE RESTRICT;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_tour_departure_public
    ON tour_departure(tour_id, departure_at, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_booking_tour_departure_status
    ON booking(tour_departure_id, status) WHERE tour_departure_id IS NOT NULL;

-- Preserve concrete dates already used by legacy bookings without inventing an endless daily schedule.
INSERT INTO tour_departure (tour_id, departure_at, capacity, price, child_price, infant_price, currency, status)
SELECT b.tour_id,
       b.departure_at,
       GREATEST(t.capacity, COUNT(bd.booking_detail_id))::int,
       t.price,
       COALESCE(t.child_price, t.price * 0.65),
       COALESCE(t.infant_price, 0),
       COALESCE(t.currency, 'VND'),
       CASE WHEN b.departure_at > CURRENT_TIMESTAMP THEN 'open' ELSE 'departed' END
FROM booking b
JOIN tour t ON t.tour_id = b.tour_id
LEFT JOIN booking_detail bd ON bd.booking_id = b.booking_id
WHERE b.departure_at IS NOT NULL
GROUP BY b.tour_id, b.departure_at, t.capacity, t.price, t.child_price, t.infant_price, t.currency
ON CONFLICT (tour_id, departure_at) DO NOTHING;

UPDATE booking b
SET tour_departure_id = td.tour_departure_id
FROM tour_departure td
WHERE b.tour_departure_id IS NULL
  AND b.tour_id = td.tour_id
  AND b.departure_at = td.departure_at;
