const Joi = require('joi');

const optionalText = Joi.string().allow(null, '');
const id = Joi.number().integer().positive();
const money = Joi.number().min(0);
const fullNamePattern = /^[\p{L}]+(?:\s+[\p{L}]+)+$/u;
const fullNameMessage = 'Name must contain at least 2 words and use letters/spaces only, for example: Nguyen Van A or Le Minh';
const vietnamPhonePattern = /^0(?:3|5|7|8|9)\d{8}$/;
const uploadedOrRemoteImage = (folder) => Joi.string().trim().custom((value, helpers) => {
  if (!value || value.startsWith(`/public/${folder}/`)) {
    return value;
  }

  const { error } = Joi.string().uri().validate(value);
  if (error) {
    return helpers.error('string.uri');
  }

  return value;
}).allow(null, '');
const passengerSchema = Joi.object({
  passenger_name: Joi.string().trim().max(150).pattern(fullNamePattern).required().messages({
    'string.base': fullNameMessage,
    'string.empty': fullNameMessage,
    'string.max': 'passenger_name must not exceed 150 characters',
    'string.pattern.base': fullNameMessage,
    'any.required': 'passenger_name is required',
  }),
  age_category: Joi.string().valid('adult', 'child', 'infant').required(),
  price: Joi.forbidden().messages({ 'any.unknown': 'passenger price is calculated by server from tour price' }),
  seat_number: optionalText,
  special_request: optionalText,
});
const bookingFields = {
  tour_id: id.required(),
  contact_phone: Joi.string().trim().pattern(vietnamPhonePattern).required().messages({
    'string.base': 'contact_phone must be a string',
    'string.empty': 'contact_phone is required',
    'string.pattern.base': 'contact_phone must be a valid Vietnamese mobile number with 10 digits, for example: 0901234567',
    'any.required': 'contact_phone is required',
  }),
  travel_date: Joi.date(),
  coupon_code: Joi.string().trim().uppercase().allow(null, ''),
  coupon_id: Joi.forbidden().messages({ 'any.unknown': 'Use coupon_code to apply coupon' }),
  original_amount: Joi.forbidden().messages({ 'any.unknown': 'original_amount is calculated by server' }),
  discount_amount: Joi.forbidden().messages({ 'any.unknown': 'discount_amount is calculated by server' }),
  final_amount: Joi.forbidden().messages({ 'any.unknown': 'final_amount is calculated by server' }),
  status: Joi.forbidden().messages({ 'any.unknown': 'status is managed by server' }),
  payment_status: Joi.forbidden().messages({ 'any.unknown': 'payment_status is managed by server' }),
  request_id: Joi.string().uuid(),
  policy_accepted: Joi.boolean().valid(true),
  passengers: Joi.array().items(passengerSchema).min(1).required(),
};

module.exports = {
  user: Joi.object({
    name: Joi.string().max(150).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).allow(null, ''),
    role: Joi.string().valid('admin', 'staff', 'customer').default('customer'),
    status: Joi.string().allow(null, ''),
    profile_info: optionalText,
    google_id: optionalText,
    avatar_url: Joi.string().uri().allow(null, ''),
  }),
  destinationCategory: Joi.object({
    name: Joi.string().trim().max(150).required(),
    description: optionalText,
  }),
  tourCategory: Joi.object({
    name: Joi.string().trim().max(150).required(),
    description: optionalText,
  }),
  blogCategory: Joi.object({
    name: Joi.string().trim().max(150).required(),
    description: optionalText,
  }),
  travelDestination: Joi.object({
    name: Joi.string().trim().max(200).required(),
    description: optionalText,
    thumbnail: uploadedOrRemoteImage('travel-destinations'),
    latitude: Joi.number().min(-90).max(90).allow(null),
    longitude: Joi.number().min(-180).max(180).allow(null),
    destination_category_id: id.allow(null),
  }),
  tour: require('./tour.validator').create.body,
  location: Joi.object({
    travel_destination_id: id,
    name: Joi.string().trim().max(255),
    latitude: Joi.number().allow(null),
    longitude: Joi.number().allow(null),
    description: optionalText,
    thumbnail: Joi.string().trim().uri().allow(null, ''),
    destination_id: id,
  }).min(1),
  map: Joi.object({
    location_id: id.required(),
    title: Joi.string().trim().max(255).required(),
    map_file: Joi.string().trim().required(),
    description: optionalText,
    display_order: Joi.number().integer().min(0).allow(null),
  }),
  view360: Joi.object({
    location_id: id.required(),
    title: Joi.string().trim().max(255).required(),
    description: optionalText,
    audio_file: optionalText,
    language: Joi.string().trim().max(50).default('vi'),
    order_index: Joi.number().integer().min(0).allow(null),
  }),
  view360Image: Joi.object({ view_id: id.required(), image_file: Joi.string().required(), order_index: Joi.number().integer().min(0).allow(null) }),
  bookingCustomer: Joi.object({
    ...bookingFields,
    request_id: Joi.string().uuid().required(),
    policy_accepted: Joi.boolean().valid(true).required(),
    user_id: Joi.forbidden(),
    departure_at: Joi.forbidden().messages({ 'any.unknown': 'Customer must use travel_date; departure_at is calculated by server' }),
    travel_date: Joi.date().required(),
  }),
  bookingStaff: Joi.object({
    ...bookingFields,
    user_id: id.required(),
    departure_at: Joi.date(),
  }).or('travel_date', 'departure_at'),
  bookingCancel: Joi.object({ reason: Joi.string().trim().min(1).max(1000).allow(null, '') }).default({}),
  manualBookingConfirmation: Joi.object({
    transaction_code: Joi.string().trim().max(255),
    note: Joi.string().trim().max(1000),
  }),
  bookingDetail: Joi.object({
    booking_id: id.required(),
    passenger_name: Joi.string().trim().max(150).pattern(fullNamePattern).required().messages({
      'string.base': fullNameMessage,
      'string.empty': fullNameMessage,
      'string.max': 'passenger_name must not exceed 150 characters',
      'string.pattern.base': fullNameMessage,
      'any.required': 'passenger_name is required',
    }),
    age_category: Joi.string().valid('adult', 'child', 'infant').required(),
    price: money.required(),
    seat_number: optionalText,
    special_request: optionalText,
  }),
  payment: Joi.object({
    booking_id: id.required(),
    amount: money.required(),
    payment_method: optionalText,
    payment_date: Joi.date(),
    status: Joi.string().valid('pending', 'paid', 'failed', 'expired', 'refunded').required(),
    transaction_code: optionalText,
    currency: Joi.string().max(20).default('VND'),
  }),
  paymentStatus: Joi.object({
    status: Joi.string()
      .valid('paid', 'pending', 'refunded')
      .required(),
  }),
  coupon: Joi.object({
    code: Joi.string().trim().uppercase().max(50).required(),
    name: Joi.string().trim().max(150).required(),
    description: optionalText,
    discount_type: Joi.string().valid('percentage', 'fixed').required(),
    discount_value: money.required(),
    max_discount_amount: money.allow(null),
    min_order_amount: money.default(0),
    usage_limit: Joi.number().integer().min(1).allow(null),
    used_count: Joi.number().integer().min(0).default(0),
    start_date: Joi.date().allow(null),
    end_date: Joi.date().allow(null),
    status: Joi.string().valid('active', 'inactive', 'expired').default('active'),
  }),
  blog: Joi.object({
    user_id: id,
    title: Joi.string().max(255).required(),
    slug: Joi.string().trim().lowercase().max(255).pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    thumbnail: uploadedOrRemoteImage('blogs'),
    content: optionalText,
    status: Joi.string().valid('draft', 'published', 'archived').default('published'),
    published_at: Joi.date().iso().allow(null),
    category_ids: Joi.array().items(id).default([]),
    location_ids: Joi.array().items(id).default([]),
  }),
  blogUpdate: Joi.object({
    title: Joi.string().max(255),
    slug: Joi.string().trim().lowercase().max(255).pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    thumbnail: uploadedOrRemoteImage('blogs'),
    content: optionalText,
    status: Joi.string().valid('draft', 'published', 'archived'),
    published_at: Joi.date().iso().allow(null),
    category_ids: Joi.array().items(id),
    location_ids: Joi.array().items(id),
  }).min(1),
  blogLocation: Joi.object({ blog_id: id.required(), location_id: id.required() }),
  review: Joi.object({
    user_id: id.required(),
    location_id: id,
    booking_id: id,
    tour_id: id,
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().trim().max(1000).allow(null, ''),
    images: optionalText,
    status: Joi.string().valid('pending', 'approved', 'rejected').default('approved'),
  }),
  statistics: Joi.object({ type: Joi.string().max(100).required(), data: Joi.object().required() }),
};
