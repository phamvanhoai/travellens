const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'location',
  primaryKey: 'location_id',
  fields: ['name', 'latitude', 'longitude', 'description', 'destination_id'],
  searchable: ['name', 'description'],
  filters: ['destination_id'],
});
