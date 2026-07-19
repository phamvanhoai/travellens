const test = require('node:test');
const assert = require('node:assert/strict');
const story = require('../src/validators/travelStory.validator');

test('travel story accepts image and video media', () => {
  assert.equal(story.create.body.validate({
    media_url: '/public/travel-stories/photo.webp',
    media_type: 'image',
    caption: 'A day in Saigon',
  }).error, undefined);
  assert.equal(story.create.body.validate({
    media_url: 'https://cdn.example.com/story.mp4',
    media_type: 'video',
  }).error, undefined);
});

test('travel story requires valid media and limits caption', () => {
  assert.ok(story.create.body.validate({ media_type: 'image' }).error);
  assert.ok(story.create.body.validate({
    media_url: '/wrong/path.jpg',
    media_type: 'image',
  }).error);
  assert.ok(story.create.body.validate({
    media_url: 'https://cdn.example.com/story.jpg',
    media_type: 'image',
    caption: 'x'.repeat(1001),
  }).error);
});
