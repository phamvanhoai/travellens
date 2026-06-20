const Joi = require('joi');

const optionalText = Joi.string().allow(null, '');
const id = Joi.number().integer().positive();
const money = Joi.number().min(0);
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
  booking: Joi.object({
    user_id: id,
    tour_id: id.required(),
    coupon_id: id.allow(null),
    coupon_code: Joi.string().trim().uppercase().allow(null, ''),
    original_amount: money,
    discount_amount: money,
    final_amount: money,
    status: Joi.string().valid('confirmed', 'canceled', 'pending').default('pending'),
    payment_status: Joi.string().valid('unpaid', 'paid', 'failed', 'refunded', 'pending').default('unpaid'),
    passengers: Joi.array().items(Joi.object({
      passenger_name: Joi.string().max(150).required(),
      age_category: Joi.string().valid('adult', 'child', 'infant').required(),
      price: money.required(),
      seat_number: optionalText,
      special_request: optionalText,
    })).min(1).required(),
  }),
  bookingDetail: Joi.object({
    booking_id: id.required(),
    passenger_name: Joi.string().max(150).required(),
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
    content: optionalText,
    location_ids: Joi.array().items(id).default([]),
  }),
  blogUpdate: Joi.object({
    title: Joi.string().max(255),
    content: optionalText,
    location_ids: Joi.array().items(id),
  }).min(1),
  blogLocation: Joi.object({ blog_id: id.required(), location_id: id.required() }),
  review: Joi.object({
    user_id: id.required(),
    location_id: id.required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().trim().max(1000).allow(null, ''),
    images: optionalText,
    status: Joi.string().valid('pending', 'approved', 'rejected').default('approved'),
  }),
  statistics: Joi.object({ type: Joi.string().max(100).required(), data: Joi.object().required() }),
};
