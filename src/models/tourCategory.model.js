const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'tour_category',
  primaryKey: 'tour_category_id',
  fields: ['name', 'description', 'created_at', 'updated_at'],
  searchable: ['name', 'description'],
});

