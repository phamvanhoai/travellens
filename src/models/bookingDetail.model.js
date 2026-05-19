const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'booking_detail',
  primaryKey: 'booking_detail_id',
  fields: ['booking_id', 'passenger_name', 'age_category', 'price', 'seat_number', 'special_request'],
  searchable: ['passenger_name', 'seat_number'],
  filters: ['booking_id', 'age_category'],
});

