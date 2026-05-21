const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'destination_category',
  primaryKey: 'destination_category_id',
  fields: ['name', 'description', 'created_at', 'updated_at'],
  searchable: ['name', 'description'],
});

