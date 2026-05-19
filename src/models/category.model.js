const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'category',
  primaryKey: 'category_id',
  fields: ['name', 'description'],
  searchable: ['name', 'description'],
});

