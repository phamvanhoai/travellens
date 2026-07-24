-- booking.departure_at is a legacy TIMESTAMP column storing Vietnam wall-clock
-- time, while tour_departure.departure_at is an absolute TIMESTAMPTZ instant.
-- Normalize linked bookings to the configured Vietnam departure time.
UPDATE booking b
SET departure_at = td.departure_at AT TIME ZONE 'Asia/Ho_Chi_Minh'
FROM tour_departure td
WHERE b.tour_departure_id = td.tour_departure_id
  AND b.departure_at IS DISTINCT FROM (
    td.departure_at AT TIME ZONE 'Asia/Ho_Chi_Minh'
  );
