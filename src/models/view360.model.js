const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'view360',
  primaryKey: 'view_id',
  fields: ['location_id', 'description', 'audio_file', 'language'],
  searchable: ['description', 'language'],
  filters: ['location_id', 'language'],
});

