const Joi = require('joi');

const id = Joi.number().integer().positive();
const optionalText = Joi.string().allow(null, '');
const stringList = Joi.array().items(Joi.string().trim().min(1).max(500));
const time = Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/).allow(null, '');
const faqList = Joi.array().items(Joi.object({
  faq_id: id,
  question: Joi.string().trim().max(500).required(),
  answer: Joi.string().trim().max(5000).required(),
  order_index: Joi.number().integer().min(1).required(),
}));
const thumbnail = Joi.string().trim().custom((value, helpers) => {
  if (!value || value.startsWith('/public/tours/')) {
    return value;
  }

  const { error } = Joi.string().uri().validate(value);
  if (error) {
    return helpers.error('string.uri');
  }

  return value;
}).allow(null, '');
const mediaUrl = Joi.string().trim().custom((value, helpers) => {
  if (!value || value.startsWith('/public/')) return value;
  const { error } = Joi.string().uri().validate(value);
  return error ? helpers.error('string.uri') : value;
}).allow(null, '');
const galleryList = Joi.array().items(Joi.object({
  media_id: id,
  type: Joi.string().valid('image', 'video').default('image'),
  url: mediaUrl.required(),
  alt: Joi.string().trim().max(500).allow(null, ''),
  order_index: Joi.number().integer().min(1).required(),
}));

const destinationSchema = Joi.object({
  destination_id: id.required(),
  order_index: Joi.number().integer().min(1).required(),
  estimated_time: optionalText,
  estimated_minutes: Joi.number().integer().min(0).allow(null),
  day_number: Joi.number().integer().min(1).default(1),
  start_time: time,
  end_time: time,
  activity: optionalText,
  note: optionalText,
});
const contentItems = Joi.array().items(Joi.object({
  id: id.required(),
  sort_order: Joi.number().integer().min(1).required(),
})).unique('id').unique('sort_order');

const tourBody = {
  content_items: contentItems.default([]),
  tour_category_id: id.required(),
  name: Joi.string().trim().max(255).required(),
  slug: Joi.string().trim().lowercase().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(255),
  short_description: optionalText,
  description: optionalText,
  price: Joi.number().min(0).required(),
  child_price: Joi.number().min(0).required(),
  infant_price: Joi.number().min(0).default(0),
  currency: Joi.string().trim().uppercase().length(3).default('VND'),
  schedule: Joi.string().trim().required(),
  duration_days: Joi.number().integer().min(0).default(1),
  duration_nights: Joi.number().integer().min(0).default(0),
  start_time: time,
  end_time: time,
  tour_type: Joi.string().valid('group', 'private', 'self_guided').default('group'),
  languages: Joi.array().items(Joi.string().trim().lowercase().max(10)).min(1).default(['vi']),
  difficulty: Joi.string().valid('easy', 'moderate', 'challenging', 'difficult').default('easy'),
  minimum_participants: Joi.number().integer().min(1).default(1),
  minimum_booking: Joi.number().integer().min(1).default(1),
  maximum_booking: Joi.number().integer().min(1).allow(null),
  meeting_point: optionalText,
  pickup_available: Joi.boolean().default(false),
  pickup_description: optionalText,
  highlights: stringList,
  inclusions: stringList,
  exclusions: stringList,
  requirements: stringList,
  cancellation_policy: optionalText,
  booking_policy: optionalText,
  additional_information: optionalText,
  faqs: faqList.default([]),
  video_url: Joi.string().uri().allow(null, ''),
  gallery: galleryList.default([]),
  capacity: Joi.number().integer().min(1).required(),
  thumbnail,
  thumbnail_url: thumbnail,
  status: Joi.string().valid('active', 'inactive', 'draft').default('active'),
};

module.exports = {
  list: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      search: Joi.string().allow(''),
      destination_id: id,
      tour_category_id: id,
      status: Joi.string().valid('active', 'inactive', 'draft', 'deleted'),
      sortBy: Joi.string().valid('tour_id', 'name', 'price', 'capacity', 'status', 'created_at', 'updated_at').default('created_at'),
      sortOrder: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC'),
    }).unknown(false),
  },
  detail: {
    params: Joi.object({
      id: id.required(),
    }),
  },
  create: {
    body: Joi.object({
      ...tourBody,
      destinations: Joi.array().items(destinationSchema).min(1).required(),
    }),
  },
  update: {
    params: Joi.object({
      id: id.required(),
    }),
    body: Joi.object({
      content_items: contentItems,
      tour_category_id: id,
      name: Joi.string().trim().max(255),
      slug: Joi.string().trim().lowercase().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(255),
      short_description: optionalText,
      description: optionalText,
      price: Joi.number().min(0),
      child_price: Joi.number().min(0),
      infant_price: Joi.number().min(0),
      currency: Joi.string().trim().uppercase().length(3),
      schedule: Joi.string().trim(),
      duration_days: Joi.number().integer().min(0),
      duration_nights: Joi.number().integer().min(0),
      start_time: time,
      end_time: time,
      tour_type: Joi.string().valid('group', 'private', 'self_guided'),
      languages: Joi.array().items(Joi.string().trim().lowercase().max(10)).min(1),
      difficulty: Joi.string().valid('easy', 'moderate', 'challenging', 'difficult'),
      minimum_participants: Joi.number().integer().min(1),
      minimum_booking: Joi.number().integer().min(1),
      maximum_booking: Joi.number().integer().min(1).allow(null),
      meeting_point: optionalText,
      pickup_available: Joi.boolean(),
      pickup_description: optionalText,
      highlights: stringList,
      inclusions: stringList,
      exclusions: stringList,
      requirements: stringList,
      cancellation_policy: optionalText,
      booking_policy: optionalText,
      additional_information: optionalText,
      faqs: faqList,
      video_url: Joi.string().uri().allow(null, ''),
      gallery: galleryList,
      capacity: Joi.number().integer().min(1),
      thumbnail,
      thumbnail_url: thumbnail,
      status: Joi.string().valid('active', 'inactive', 'draft'),
      destinations: Joi.array().items(destinationSchema).min(1),
    }).min(1),
  },
  remove: {
    params: Joi.object({
      id: id.required(),
    }),
  },
};
