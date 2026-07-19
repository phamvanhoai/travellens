const test = require('node:test');
const assert = require('node:assert/strict');
const { tour } = require('../src/validators');
const tourService = require('../src/services/tour.service');
const tourContentItemModel = require('../src/models/tourContentItem.model');

const validTour = {
  tour_category_id: 1,
  name: 'Saigon Highlights',
  description: 'One day in Saigon',
  price: 250000,
  child_price: 150000,
  schedule: '08:00 - 17:00',
  capacity: 20,
  destinations: [{ destination_id: 1, order_index: 1 }],
};

test('tour create supplies backward-compatible detail defaults', () => {
  const result = tour.create.body.validate(validTour);
  assert.equal(result.error, undefined);
  assert.deepEqual(result.value.languages, ['vi']);
  assert.equal(result.value.highlights, undefined);
  assert.deepEqual(result.value.faqs, []);
  assert.equal(result.value.currency, 'VND');
  assert.equal(result.value.infant_price, 0);
});

test('tour update does not overwrite omitted JSON detail fields', () => {
  const result = tour.update.body.validate({ name: 'Updated tour' });
  assert.equal(result.error, undefined);
  assert.equal(result.value.highlights, undefined);
  assert.equal(result.value.gallery, undefined);
  assert.equal(result.value.faqs, undefined);
});

test('tour detail validator accepts ordered FAQ, gallery and itinerary data', () => {
  const result = tour.create.body.validate({
    ...validTour,
    thumbnail_url: '/public/tours/cover.jpg',
    highlights: ['Local guide'],
    faqs: [{ question: 'How long?', answer: 'One day.', order_index: 1 }],
    gallery: [{ type: 'image', url: '/public/tours/gallery.jpg', order_index: 1 }],
    destinations: [{
      destination_id: 1,
      order_index: 1,
      day_number: 1,
      start_time: '09:00',
      end_time: '11:00',
      estimated_minutes: 120,
      activity: 'Sightseeing',
    }],
  });
  assert.equal(result.error, undefined);
});

test('tour slug generation handles Vietnamese names', () => {
  assert.equal(tourService.slugify('Dinh Doc Lap - Mot Ngay'), 'dinh-doc-lap-mot-ngay');
  assert.equal(tourService.slugify('\u0110\u00e0 N\u1eb5ng'), 'da-nang');
});

test('tour create accepts ordered reusable individual content items', () => {
  const content_items = [
    { id: 8, sort_order: 1 },
    { id: 3, sort_order: 2 },
  ];
  const result = tour.create.body.validate({ ...validTour, content_items });
  assert.equal(result.error, undefined);
  assert.deepEqual(result.value.content_items, content_items);
  assert.equal(result.value.highlights, undefined);
  assert.equal(result.value.inclusions, undefined);
});

test('individual content items merge with tour-specific list values and policies', async () => {
  const original = tourContentItemModel.findActiveByIds;
  tourContentItemModel.findActiveByIds = async () => [
    { content_item_id: 1, type: 'highlight', content: 'Shared highlight' },
    { content_item_id: 2, type: 'inclusion', content: 'Entrance ticket' },
    { content_item_id: 3, type: 'booking_policy', content: 'Book 24 hours ahead' },
  ];
  try {
    const payload = {
      content_items: [
        { id: 1, sort_order: 1 },
        { id: 2, sort_order: 2 },
        { id: 3, sort_order: 3 },
      ],
      highlights: ['Tour-specific highlight', ' shared   HIGHLIGHT '],
    };
    const selected = await tourService.applyContentItems(payload);
    assert.deepEqual(payload.highlights, ['Tour-specific highlight', 'shared   HIGHLIGHT']);
    assert.deepEqual(payload.inclusions, ['Entrance ticket']);
    assert.equal(payload.booking_policy, 'Book 24 hours ahead');
    assert.equal(payload.content_items, undefined);
    assert.deepEqual(selected.map((item) => item.content_item_id), [1, 2, 3]);
  } finally {
    tourContentItemModel.findActiveByIds = original;
  }
});
