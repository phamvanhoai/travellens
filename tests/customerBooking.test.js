const test = require('node:test');
const assert = require('node:assert/strict');
const { entity } = require('../src/validators');
const bookingService = require('../src/services/booking.service');
const bookingModel = require('../src/models/booking.model');
const db = require('../src/config/db');
const couponService = require('../src/services/coupon.service');
const couponModel = require('../src/models/coupon.model');

const customerBooking = {
  tour_id: 1,
  contact_phone: '0901234567',
  travel_date: '2030-07-15',
  passengers: [{ passenger_name: 'Nguyen Van A', age_category: 'adult' }],
};

test('customer booking requires travel_date and forbids departure/status ownership fields', () => {
  assert.equal(entity.bookingCustomer.validate(customerBooking).error, undefined);
  for (const forbidden of [
    { departure_at: '2030-07-15T01:00:00Z' },
    { user_id: 99 },
    { status: 'confirmed' },
    { payment_status: 'paid' },
  ]) {
    assert.ok(entity.bookingCustomer.validate({ ...customerBooking, ...forbidden }).error);
  }
});

test('staff booking may override departure but must provide customer user_id', () => {
  const result = entity.bookingStaff.validate({
    ...customerBooking,
    user_id: 2,
    departure_at: '2030-07-15T08:00:00+07:00',
  });
  assert.equal(result.error, undefined);
});

test('booking enforces per-booking minimum and maximum passenger limits', () => {
  assert.throws(
    () => bookingService.ensurePassengerCountAllowed({ minimum_booking: 2, maximum_booking: 5 }, 1),
    /at least 2 passengers/
  );
  assert.throws(
    () => bookingService.ensurePassengerCountAllowed({ minimum_booking: 1, maximum_booking: 3 }, 4),
    /at most 3 passengers/
  );
  assert.doesNotThrow(
    () => bookingService.ensurePassengerCountAllowed({ minimum_booking: 2, maximum_booking: 5 }, 3)
  );
});

test('booking closes 4 hours before the configured tour start time', () => {
  const now = new Date('2030-07-15T08:00:00+07:00').getTime();
  assert.throws(
    () => bookingService.ensureDepartureAtIsValid('2030-07-15T11:59:00+07:00', now),
    /at least 4 hours before/
  );
  assert.throws(
    () => bookingService.ensureDepartureAtIsValid('2030-07-15T07:00:00+07:00', now),
    /must be in the future/
  );
  assert.doesNotThrow(
    () => bookingService.ensureDepartureAtIsValid('2030-07-15T12:00:00+07:00', now)
  );
  assert.doesNotThrow(
    () => bookingService.ensureDepartureAtIsValid('2030-07-15T12:01:00+07:00', now)
  );
});

test('customer cancellation reason is optional', () => {
  assert.equal(entity.bookingCancel.validate({}).error, undefined);
  assert.equal(entity.bookingCancel.validate({ reason: 'Changed plan' }).error, undefined);
});

test('customer booking list includes the active tour review for each booking', async () => {
  const originalQuery = db.query;
  const statements = [];
  db.query = async (sql) => {
    statements.push(sql);
    return statements.length === 1 ? { rows: [{ total: 0 }] } : { rows: [] };
  };
  try {
    await bookingModel.findAll({ user_id: 58 });
    assert.match(statements[1], /FROM review r/);
    assert.match(statements[1], /r\.booking_id = b\.booking_id/);
    assert.match(statements[1], /AS review/);
    assert.match(statements[1], /r\.deleted_at IS NULL/);
  } finally {
    db.query = originalQuery;
  }
});

test('coupon booking reservation prevents concurrent over-allocation', async () => {
  const originalFind = couponModel.findByCodeForUpdate;
  const originalCount = couponModel.countActiveBookingReservations;
  couponModel.findByCodeForUpdate = async () => ({
    coupon_id: 1,
    code: 'ONLYONE',
    status: 'active',
    min_order_amount: 0,
    usage_limit: 1,
    used_count: 0,
    discount_type: 'fixed',
    discount_value: 1000,
    max_discount_amount: null,
    start_date: null,
    end_date: null,
  });
  couponModel.countActiveBookingReservations = async () => 1;
  try {
    await assert.rejects(
      couponService.validateCoupon({ code: 'ONLYONE', booking_amount: 100000 }, {}),
      /fully reserved/
    );
  } finally {
    couponModel.findByCodeForUpdate = originalFind;
    couponModel.countActiveBookingReservations = originalCount;
  }
});

test('coupon usage increment fails atomically when its limit is reached', async () => {
  const original = couponModel.incrementUsedCount;
  couponModel.incrementUsedCount = async () => null;
  try {
    await assert.rejects(couponService.markUsed(1, {}), /usage limit reached/);
  } finally {
    couponModel.incrementUsedCount = original;
  }
});

test('coupon rejects maximum discount below minimum order amount', () => {
  assert.throws(
    () => couponService.validateBusinessRules({
      discount_type: 'percentage',
      discount_value: 10,
      max_discount_amount: 50000,
      min_order_amount: 100000,
      usage_limit: 10,
      start_date: '2030-01-01',
      end_date: '2030-01-02',
    }),
    /Maximum discount amount must be greater than or equal to minimum order amount/
  );

  assert.doesNotThrow(() => couponService.validateBusinessRules({
    discount_type: 'percentage',
    discount_value: 10,
    max_discount_amount: 100000,
    min_order_amount: 100000,
    usage_limit: 10,
    start_date: '2030-01-01',
    end_date: '2030-01-02',
  }));
});

test('coupon accepts an omitted maximum discount but rejects a zero cap', () => {
  const payload = {
    discount_type: 'percentage',
    discount_value: 10,
    min_order_amount: 100000,
    usage_limit: 10,
    start_date: '2030-01-01',
    end_date: '2030-01-02',
  };

  assert.doesNotThrow(() => couponService.validateBusinessRules({
    ...payload,
    max_discount_amount: null,
  }));
  assert.throws(
    () => couponService.validateBusinessRules({ ...payload, max_discount_amount: 0 }),
    /Maximum discount amount must be greater than 0 or null/
  );
});
