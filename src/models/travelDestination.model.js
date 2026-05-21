const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'travel_destination',
  primaryKey: 'destination_id',
  fields: ['name', 'description', 'thumbnail', 'destination_category_id', 'created_at', 'updated_at', 'deleted_at'],
  searchable: ['name', 'description'],
  filters: ['destination_category_id', 'deleted_at'],
});
