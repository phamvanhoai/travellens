const test = require('node:test');
const assert = require('node:assert/strict');

const { location } = require('../src/validators');
const destinationCategoryService = require('../src/services/destinationCategory.service');
const tourCategoryService = require('../src/services/tourCategory.service');
const blogCategoryService = require('../src/services/blogCategory.service');
const blogModel = require('../src/models/blog.model');

test('location coordinates require a complete in-range pair', () => {
  assert.equal(location.create.body.validate({
    travel_destination_id: 1,
    name: 'Valid location',
    latitude: 10.77,
    longitude: 106.7,
  }).error, undefined);

  assert.equal(location.create.body.validate({
    travel_destination_id: 1,
    name: 'No coordinates',
    latitude: null,
    longitude: null,
  }).error, undefined);

  assert.ok(location.create.body.validate({
    travel_destination_id: 1,
    name: 'Partial coordinates',
    latitude: 10.77,
  }).error);
  assert.ok(location.create.body.validate({
    travel_destination_id: 1,
    name: 'Invalid coordinates',
    latitude: 999,
    longitude: 999,
  }).error);
});

test('category services translate duplicate database constraints to HTTP 409', async () => {
  for (const service of [
    destinationCategoryService,
    tourCategoryService,
    blogCategoryService,
  ]) {
    const originalCreate = service.model.create;
    service.model.create = async () => {
      const error = new Error('duplicate');
      error.code = '23505';
      throw error;
    };
    try {
      await assert.rejects(
        service.create({ name: 'Duplicate' }),
        (error) => error.statusCode === 409
      );
    } finally {
      service.model.create = originalCreate;
    }
  }
});

test('blog model uses database current time for immediate publishing', async () => {
  const calls = [];
  const executor = {
    async query(sql, values) {
      calls.push({ sql, values });
      return { rows: [{ blog_id: 1 }] };
    },
  };

  await blogModel.createBlog({
    user_id: 1,
    title: 'Published now',
    slug: 'published-now',
    thumbnail: null,
    content: null,
    status: 'published',
    published_at: null,
    publish_now: true,
  }, executor);
  await blogModel.updateBlog(1, { status: 'published', publish_now: true }, executor);

  assert.match(calls[0].sql, /CURRENT_TIMESTAMP/);
  assert.equal(calls[0].values.length, 6);
  assert.match(calls[1].sql, /published_at = CURRENT_TIMESTAMP/);
  assert.deepEqual(calls[1].values, ['published', 1]);
});
