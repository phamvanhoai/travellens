const test = require('node:test');
const assert = require('node:assert/strict');
const schema = require('../src/validators/tourContentItem.validator');

test('tour content item accepts every supported reusable content type', () => {
  for (const type of [
    'highlight', 'requirement', 'inclusion', 'exclusion',
    'booking_policy', 'cancellation_policy', 'additional_information',
  ]) {
    const result = schema.create.body.validate({ type, content: `Content for ${type}` });
    assert.equal(result.error, undefined);
    assert.equal(result.value.status, 'active');
  }
});

test('tour content item rejects unsupported content types', () => {
  const result = schema.create.body.validate({ type: 'template', content: 'Invalid' });
  assert.ok(result.error);
});
