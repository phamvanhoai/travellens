const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'users',
  primaryKey: 'user_id',
  fields: ['name', 'email', 'password', 'role', 'status', 'profile_info', 'google_id', 'avatar_url'],
  searchable: ['name', 'email'],
  filters: ['role', 'status', 'google_id'],
});

