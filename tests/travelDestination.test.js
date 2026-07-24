const test = require('node:test');
const assert = require('node:assert/strict');
const { entity } = require('../src/validators');

const baseDestination = {
  name: 'Test Destination',
  description: 'Validation test',
  destination_category_id: null,
};

test('travel destination accepts a complete coordinate pair or no coordinates', () => {
  assert.equal(entity.travelDestination.validate({
    ...baseDestination,
    latitude: 10.0452,
    longitude: 105.7469,
  }).error, undefined);

  assert.equal(entity.travelDestination.validate({
    ...baseDestination,
    latitude: null,
    longitude: null,
  }).error, undefined);
});

test('travel destination rejects an incomplete coordinate pair', () => {
  const latitudeOnly = entity.travelDestination.validate({
    ...baseDestination,
    latitude: 10.0452,
    longitude: null,
  });
  const longitudeOnly = entity.travelDestination.validate({
    ...baseDestination,
    latitude: null,
    longitude: 105.7469,
  });

  assert.match(latitudeOnly.error?.message ?? '', /Latitude and longitude must be provided together/);
  assert.match(longitudeOnly.error?.message ?? '', /Latitude and longitude must be provided together/);
});
