const test = require('node:test');
const assert = require('node:assert/strict');

const { entity } = require('../src/validators');
const bookingService = require('../src/services/booking.service');
const reviewModel = require('../src/models/review.model');

test('staff booking update only accepts a valid Vietnamese contact phone', () => {
  assert.equal(entity.bookingStaffUpdate.validate({
    contact_phone: '0901234567',
  }).error, undefined);
  assert.ok(entity.bookingStaffUpdate.validate({
    contact_phone: '1234567890',
  }).error);
  assert.ok(entity.bookingStaffUpdate.validate({
    contact_phone: '0901234567',
    status: 'confirmed',
  }).error);
});

test('staff idempotent response preserves the replay marker', async () => {
  const originalCreate = bookingService.create;
  const originalGet = bookingService.getForStaff;
  bookingService.create = async () => ({
    booking_id: 42,
    payment_required: true,
    payment_method: 'bank_transfer',
    idempotent_replay: true,
  });
  bookingService.getForStaff = async () => ({
    booking_id: 42,
    passengers: [],
  });

  try {
    const result = await bookingService.createForStaff({});
    assert.equal(result.booking_id, 42);
    assert.equal(result.idempotent_replay, true);
  } finally {
    bookingService.create = originalCreate;
    bookingService.getForStaff = originalGet;
  }
});

test('staff review list returns database-backed pagination metadata', async () => {
  const calls = [];
  const executor = {
    async query(sql, values) {
      calls.push({ sql, values });
      if (calls.length === 1) return { rows: [{ total: 7 }] };
      return { rows: [{ review_id: 2 }, { review_id: 1 }] };
    },
  };

  const result = await reviewModel.findForStaff({
    page: 2,
    limit: 5,
    search: 'beach',
    status: 'approved',
  }, executor);

  assert.match(calls[0].sql, /COUNT\(\*\)/);
  assert.deepEqual(calls[0].values, ['approved', '%beach%']);
  assert.deepEqual(calls[1].values, ['approved', '%beach%', 5, 5]);
  assert.deepEqual(result.pagination, {
    page: 2,
    limit: 5,
    total: 7,
    totalPages: 2,
  });
  assert.equal(result.items.length, 2);
});
