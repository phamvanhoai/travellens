const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'travel_destination',
  primaryKey: 'destination_id',
  fields: ['name', 'description', 'category_id'],
  searchable: ['name', 'description'],
  filters: ['category_id'],
});

