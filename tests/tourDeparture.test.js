const test = require('node:test');
const assert = require('node:assert/strict');
const service = require('../src/services/tourDeparture.service');
const model = require('../src/models/tourDeparture.model');
const tourModel = require('../src/models/tour.model');

test('departure capacity cannot be reduced below booked slots', async () => {
  const originalFind = model.findById;
  const originalCount = model.countBookedSlots;
  const originalBookingCount = model.countBookings;
  model.findById = async () => ({ tour_departure_id: 1, tour_id: 2, departure_at: '2030-01-01T08:00:00+07:00', capacity: 10, status: 'open' });
  model.countBookedSlots = async () => 6;
  model.countBookings = async () => 1;
  try {
    await assert.rejects(service.update(2, 1, { capacity: 5 }), /cannot be lower than 6/);
    await assert.rejects(service.update(2, 1, { departure_at: '2030-01-02T08:00:00+07:00' }), /cannot be changed/);
    await assert.rejects(service.update(2, 1, { status: 'cancelled' }), /cannot be cancelled/);
  } finally {
    model.findById = originalFind;
    model.countBookedSlots = originalCount;
    model.countBookings = originalBookingCount;
  }
});

test('departure with bookings cannot be deleted', async () => {
  const originalFind = model.findById;
  const originalCount = model.countBookings;
  model.findById = async () => ({ tour_departure_id: 1, tour_id: 2 });
  model.countBookings = async () => 1;
  try {
    await assert.rejects(service.remove(2, 1), /cannot be deleted/);
  } finally {
    model.findById = originalFind;
    model.countBookings = originalCount;
  }
});

test('bulk schedule creates only selected weekdays and reports duplicates as skipped', async () => {
  const originalTour = tourModel.findRawById;
  const originalBulkCreate = model.bulkCreate;
  tourModel.findRawById = async () => ({ tour_id: 2, capacity: 20, price: 100000, child_price: 65000, infant_price: 0, currency: 'VND' });
  let generated = [];
  model.bulkCreate = async (items) => { generated = items; return items.slice(0, -1); };
  try {
    const result = await service.bulkCreate(2, { start_date: '2030-01-01', end_date: '2030-01-07', weekdays: [1, 3, 5], departure_time: '08:00', booking_close_hours_before: 4, status: 'draft' });
    assert.equal(generated.length, 3);
    assert.deepEqual(generated.map((item) => new Date(item.departure_at).getUTCDay()).sort(), [1, 3, 5]);
    assert.equal(result.created_count, 2);
    assert.equal(result.skipped_count, 1);
    assert.ok(generated.every((item) => new Date(item.departure_at) - new Date(item.booking_close_at) === 4 * 3600000));
  } finally {
    tourModel.findRawById = originalTour;
    model.bulkCreate = originalBulkCreate;
  }
});
