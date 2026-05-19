const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'location',
  primaryKey: 'location_id',
  fields: ['name', 'latitude', 'longitude', 'description', 'category_id', 'destination_id'],
  searchable: ['name', 'description'],
  filters: ['category_id', 'destination_id'],
});

