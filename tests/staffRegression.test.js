const test = require('node:test');
const assert = require('node:assert/strict');

const { entity } = require('../src/validators');
const bookingService = require('../src/services/booking.service');

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
