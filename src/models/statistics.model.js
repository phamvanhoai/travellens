const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'statistics',
  primaryKey: 'stat_id',
  fields: ['type', 'data', 'created_at'],
  searchable: ['type'],
  filters: ['type'],
});

