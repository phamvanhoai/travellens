const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'booking',
  primaryKey: 'booking_id',
  fields: ['user_id', 'tour_id', 'coupon_id', 'original_amount', 'discount_amount', 'final_amount', 'status', 'payment_status', 'date_created'],
  filters: ['user_id', 'tour_id', 'status', 'payment_status'],
});
