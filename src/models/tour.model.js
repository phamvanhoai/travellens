const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'tour',
  primaryKey: 'tour_id',
  fields: ['name', 'description', 'price', 'schedule', 'capacity', 'destination_id', 'tour_category_id'],
  searchable: ['name', 'description', 'schedule'],
  filters: ['destination_id', 'tour_category_id'],
});
