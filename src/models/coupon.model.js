const BaseModel = require('./base.model');

module.exports = new BaseModel({
  table: 'coupon',
  primaryKey: 'coupon_id',
  fields: [
    'code',
    'name',
    'description',
    'discount_type',
    'discount_value',
    'min_order_amount',
    'max_discount_amount',
    'usage_limit',
    'used_count',
    'starts_at',
    'expires_at',
    'status',
  ],
  searchable: ['code', 'name', 'description'],
  filters: ['code', 'discount_type', 'status'],
});

