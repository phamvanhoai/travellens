const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'view360_image',
  primaryKey: 'image_id',
  fields: ['view_id', 'image_file', 'order_index'],
  filters: ['view_id'],
});

