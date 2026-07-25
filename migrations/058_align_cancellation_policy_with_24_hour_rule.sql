BEGIN;

UPDATE tour
SET cancellation_policy = 'Hoàn 100% khi hủy trước giờ khởi hành ít nhất 24 giờ.',
    updated_at = CURRENT_TIMESTAMP
WHERE cancellation_policy ILIKE '%7 ngày%';

UPDATE tour_content_item
SET content = 'Hoàn 100% khi hủy trước giờ khởi hành ít nhất 24 giờ',
    normalized_content = LOWER('Hoàn 100% khi hủy trước giờ khởi hành ít nhất 24 giờ'),
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'cancellation_policy'
  AND content ILIKE '%7 ngày%';

COMMIT;
