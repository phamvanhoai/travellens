const test = require('node:test');
const assert = require('node:assert/strict');
const { groupTrip } = require('../src/validators');
const groupTripService = require('../src/services/groupTrip.service');

const baseCustom = {
  itinerary_date: '2026-08-11',
  start_time: '17:30',
  title: 'Explore Hoi An Ancient Town',
  custom_location: 'Hoi An Ancient Town',
  latitude: 15.8801,
  longitude: 108.338,
  order_index: 1,
};

test('create accepts a complete custom location', () => {
  const { error, value } = groupTrip.createItineraryItem.body.validate(baseCustom);
  assert.equal(error, undefined);
  assert.equal(value.latitude, 15.8801);
  assert.equal(value.longitude, 108.338);
});

test('create accepts a system location without custom coordinates', () => {
  const { error } = groupTrip.createItineraryItem.body.validate({
    itinerary_date: '2026-08-11',
    title: 'Visit system location',
    location_id: 12,
  });
  assert.equal(error, undefined);
});

test('create rejects incomplete, mixed, and out-of-range custom locations', () => {
  assert.ok(groupTrip.createItineraryItem.body.validate({
    ...baseCustom,
    longitude: undefined,
  }).error);
  assert.ok(groupTrip.createItineraryItem.body.validate({
    ...baseCustom,
    location_id: 12,
  }).error);
  assert.ok(groupTrip.createItineraryItem.body.validate({
    ...baseCustom,
    latitude: 91,
  }).error);
  assert.ok(groupTrip.createItineraryItem.body.validate({
    ...baseCustom,
    longitude: -181,
  }).error);
});

test('update permits unrelated fields for legacy custom items without coordinates', () => {
  const { error } = groupTrip.updateItineraryItem.body.validate({ title: 'Updated title' });
  assert.equal(error, undefined);
});

test('switching custom location to system location clears custom fields', async () => {
  const executor = { query: async () => ({ rows: [{ location_id: 12 }] }) };
  const result = await groupTripService.normalizeItineraryLocation(
    { location_id: 12 },
    { custom_location: 'Old place', latitude: '15.1', longitude: '108.1' },
    executor
  );
  assert.deepEqual(result, {
    location_id: 12,
    custom_location: null,
    latitude: null,
    longitude: null,
  });
});

test('switching system location to custom location stores complete coordinates', async () => {
  const result = await groupTripService.normalizeItineraryLocation(baseCustom, { location_id: 12 });
  assert.equal(result.location_id, null);
  assert.equal(result.custom_location, 'Hoi An Ancient Town');
  assert.equal(result.latitude, 15.8801);
  assert.equal(result.longitude, 108.338);
});

