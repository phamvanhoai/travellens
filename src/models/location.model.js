const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'location',
  primaryKey: 'location_id',
  fields: ['name', 'latitude', 'longitude', 'description', 'thumbnail', 'destination_id', 'created_at', 'updated_at', 'deleted_at'],
  searchable: ['name', 'description'],
  filters: ['destination_id'],
});
