const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'review',
  primaryKey: 'review_id',
  fields: ['user_id', 'location_id', 'rating', 'comment', 'images', 'date_created'],
  searchable: ['comment'],
  filters: ['user_id', 'location_id', 'rating'],
});

