const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'map',
  primaryKey: 'map_id',
  fields: ['location_id', 'map_file', 'description'],
  searchable: ['description'],
  filters: ['location_id'],
});

