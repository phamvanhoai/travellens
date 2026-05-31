const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'blog',
  primaryKey: 'blog_id',
  fields: ['user_id', 'title', 'content', 'date_created','views'],
  searchable: ['title', 'content'],
  filters: ['user_id'],
});

