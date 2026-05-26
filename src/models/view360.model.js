const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'view360',
  primaryKey: 'view_id',
  fields: ['location_id', 'title', 'description', 'audio_file', 'language', 'order_index', 'created_at', 'updated_at', 'deleted_at'],
  searchable: ['title', 'description', 'language'],
  filters: ['location_id', 'language'],
});
