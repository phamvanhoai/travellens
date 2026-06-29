ALTER TABLE booking DROP CONSTRAINT IF EXISTS booking_status_check;
ALTER TABLE booking
    ADD CONSTRAINT booking_status_check
    CHECK (status IN ('pending', 'confirmed', 'cancel_pending', 'canceled', 'expired'));

UPDATE booking b
SET status = 'cancel_pending'
WHERE b.status = 'pending'
  AND b.payment_status = 'paid'
  AND EXISTS (
      SELECT 1
      FROM refund_request rr
      WHERE rr.booking_id = b.booking_id
        AND rr.status = 'pending'
  );
