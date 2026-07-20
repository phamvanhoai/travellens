const test = require('node:test');
const assert = require('node:assert/strict');

const groupTripModel = require('../src/models/groupTrip.model');
const { groupTrip } = require('../src/validators');

test('admin group trip filters accept supported values and reject unsupported values', () => {
  const valid = groupTrip.adminListQuery.validate({
    page: 1,
    limit: 20,
    search: 'Ninh Kieu',
    visibility: 'private',
    status: 'archived',
  });
  assert.equal(valid.error, undefined);

  assert.ok(groupTrip.adminListQuery.validate({ visibility: 'all' }).error);
  assert.ok(groupTrip.adminListQuery.validate({ status: 'deleted' }).error);
});

test('admin group trip edit reuses the settings payload validation', () => {
  const valid = groupTrip.updateSettings.body.validate({
    name: 'Updated group trip',
    visibility: 'public',
    max_members: 12,
  });
  assert.equal(valid.error, undefined);
  assert.ok(groupTrip.updateSettings.body.validate({}).error);
  assert.ok(groupTrip.updateSettings.body.validate({ visibility: 'hidden' }).error);
});

test('admin group trip list applies visibility/status/search and keeps empty pagination usable', async () => {
  const calls = [];
  const executor = {
    async query(sql, values) {
      calls.push({ sql, values });
      return calls.length === 1 ? { rows: [{ total: 0 }] } : { rows: [] };
    },
  };

  const result = await groupTripModel.listForAdmin({
    page: 2,
    limit: 10,
    search: 'trip',
    visibility: 'private',
    status: 'archived',
  }, executor);

  assert.deepEqual(calls[0].values, ['%trip%', 'private', 'archived']);
  assert.match(calls[0].sql, /gt\.visibility = \$2/);
  assert.match(calls[0].sql, /gt\.status = \$3/);
  assert.deepEqual(calls[1].values, ['%trip%', 'private', 'archived', 10, 10]);
  assert.deepEqual(result, {
    items: [],
    pagination: { page: 2, limit: 10, total: 0, totalPages: 1 },
  });
});

test('admin group trip delete marks the parent record as deleted', async () => {
  const calls = [];
  const executor = {
    async query(sql, values) {
      calls.push({ sql, values });
      return { rows: [{ group_trip_id: 42, deleted_at: '2026-07-20T00:00:00.000Z' }] };
    },
  };

  const result = await groupTripModel.softDelete(42, executor);
  assert.match(calls[0].sql, /^UPDATE group_trip/);
  assert.match(calls[0].sql, /SET deleted_at = CURRENT_TIMESTAMP/);
  assert.deepEqual(calls[0].values, [42]);
  assert.deepEqual(result, { group_trip_id: 42, deleted_at: '2026-07-20T00:00:00.000Z' });
});
