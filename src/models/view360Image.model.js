const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'view360_image',
  primaryKey: 'image_id',
  fields: ['view_id', 'image_file', 'order_index', 'created_at', 'updated_at', 'deleted_at'],
  filters: ['view_id'],
});
