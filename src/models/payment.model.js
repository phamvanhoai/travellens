const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'payment',
  primaryKey: 'payment_id',
  fields: ['booking_id', 'amount', 'payment_method', 'payment_date', 'status', 'transaction_code', 'currency'],
  searchable: ['payment_method', 'transaction_code', 'currency'],
  filters: ['booking_id', 'status'],
});

