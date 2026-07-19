const test = require('node:test');
const assert = require('node:assert/strict');
const db = require('../src/config/db');
const paymentModel = require('../src/models/payment.model');
const { payment } = require('../src/validators');

test('customer payment list validator supports only safe filters', () => {
  const valid = payment.customerList.query.validate({
    page: 2,
    limit: 10,
    search: 'PAY-3001',
    status: 'paid',
  });
  assert.equal(valid.error, undefined);
  assert.ok(payment.customerList.query.validate({ booking_id: 999 }).error);
});

test('customer payment list query always scopes records by JWT user id', async () => {
  const original = db.query;
  const calls = [];
  db.query = async (sql, values) => {
    calls.push({ sql, values });
    if (calls.length === 1) return { rows: [{ total: 1 }] };
    return { rows: [{ payment_id: 7 }] };
  };
  try {
    const result = await paymentModel.findAllOwned(42, {
      page: 1,
      limit: 20,
      search: 'PAY',
      status: 'paid',
    });
    assert.equal(result.pagination.total, 1);
    assert.deepEqual(result.items, [{ payment_id: 7 }]);
    assert.equal(calls.length, 2);
    for (const call of calls) {
      assert.match(call.sql, /b\.user_id = \$1/);
      assert.equal(call.values[0], 42);
    }
  } finally {
    db.query = original;
  }
});
