const test = require('node:test');
const assert = require('node:assert/strict');
const { entity } = require('../src/validators');
const bookingService = require('../src/services/booking.service');
const bookingModel = require('../src/models/booking.model');
const db = require('../src/config/db');
const couponService = require('../src/services/coupon.service');
const couponModel = require('../src/models/coupon.model');
const tourValidator = require('../src/validators/tour.validator');

const customerBooking = {
  tour_id: 1,
  tour_departure_id: 10,
  contact_phone: '0901234567',
  request_id: '2b37f4b6-20a8-4cc7-8e6f-c26fdd4bb301',
  policy_accepted: true,
  passengers: [{ passenger_name: 'Nguyen Van A', age_category: 'adult' }],
};

test('customer booking requires a departure and forbids custom departure/status ownership fields', () => {
  assert.equal(entity.bookingCustomer.validate(customerBooking).error, undefined);
  for (const forbidden of [
    { departure_at: '2030-07-15T01:00:00Z' },
    { travel_date: '2030-07-15' },
    { user_id: 99 },
    { status: 'confirmed' },
    { payment_status: 'paid' },
  ]) {
    assert.ok(entity.bookingCustomer.validate({ ...customerBooking, ...forbidden }).error);
  }
});

test('staff booking must choose a configured departure and provide customer user_id', () => {
  const result = entity.bookingStaff.validate({
    ...customerBooking,
    user_id: 2,
  });
  assert.equal(result.error, undefined);
});

test('customer booking requires an idempotency key and policy acceptance', () => {
  assert.ok(entity.bookingCustomer.validate({ ...customerBooking, request_id: undefined }).error);
  assert.ok(entity.bookingCustomer.validate({ ...customerBooking, policy_accepted: false }).error);
  assert.ok(entity.bookingCustomer.validate({ ...customerBooking, policy_accepted: undefined }).error);
});

test('legacy tours without child price use the same 65 percent fallback as checkout', () => {
  assert.equal(bookingService.resolvePassengerPrice({ price: 1000000, child_price: null }, 'child'), 650000);
  assert.equal(bookingService.resolvePassengerPrice({ price: 1000000, child_price: 400000 }, 'child'), 400000);
});

test('tour availability keeps a valid YYYY-MM-DD travel date unchanged', () => {
  const valid = tourValidator.availability.query.validate({ travel_date: '2026-07-24' });
  assert.equal(valid.error, undefined);
  assert.equal(valid.value.travel_date, '2026-07-24');
  assert.ok(tourValidator.availability.query.validate({ travel_date: '2026-02-30' }).error);
  assert.ok(tourValidator.availability.query.validate({ travel_date: '2026-07-24T00:00:00.000Z' }).error);
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

test('booking cancellation only accepts active cancelable statuses', () => {
  for (const status of ['pending', 'waiting_manual_confirmation', 'confirmed', 'paid']) {
    assert.doesNotThrow(() => bookingService.ensureCancelableStatus(status));
  }
  for (const status of ['canceled', 'cancelled', 'expired', 'completed', 'refunded']) {
    assert.throws(() => bookingService.ensureCancelableStatus(status), /cannot be canceled/);
  }
  assert.throws(() => bookingService.ensureCancelableStatus('cancel_pending'), /already pending/);
});

test('customer cancellation allows exactly 24 hours but rejects a later request', () => {
  const departureAt = '2030-07-16T08:00:00+07:00';
  const deadline = new Date(departureAt).getTime() - 24 * 60 * 60 * 1000;
  assert.doesNotThrow(() => bookingService.ensureCancelableBeforeDeparture(departureAt, deadline));
  assert.throws(
    () => bookingService.ensureCancelableBeforeDeparture(departureAt, deadline + 1),
    /at least 24 hours/
  );
  assert.throws(() => bookingService.ensureCancelableBeforeDeparture('invalid', deadline), /invalid/);
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

test('customer booking search is database-backed and remains scoped by user id', async () => {
  const calls = [];
  const executor = {
    async query(sql, values) {
      calls.push({ sql, values });
      return calls.length === 1
        ? { rows: [{ total: 1 }] }
        : { rows: [{ booking_id: 12 }] };
    },
  };

  const result = await bookingModel.findAll({
    user_id: 77,
    search: 'Ha Long',
    page: 1,
    limit: 5,
  }, executor);

  assert.match(calls[0].sql, /b\.user_id = \$1/);
  assert.match(calls[0].sql, /t\.name ILIKE \$2/);
  assert.match(calls[0].sql, /passenger_name ILIKE \$2/);
  assert.deepEqual(calls[0].values, [77, '%Ha Long%']);
  assert.deepEqual(calls[1].values, [77, '%Ha Long%', 5, 0]);
  assert.equal(result.pagination.total, 1);
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

test('coupon accepts maximum discount below minimum order amount', () => {
  assert.doesNotThrow(() => couponService.validateBusinessRules({
    discount_type: 'percentage',
    discount_value: 10,
    max_discount_amount: 50000,
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
