const Joi = require('joi');

const idParam = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const memberParam = Joi.object({
  id: Joi.number().integer().positive().required(),
  userId: Joi.number().integer().positive().required(),
});

const itineraryParam = Joi.object({
  id: Joi.number().integer().positive().required(),
  itemId: Joi.number().integer().positive().required(),
});

const inviteIdParam = Joi.object({
  inviteId: Joi.number().integer().positive().required(),
});

const groupInviteParam = Joi.object({
  id: Joi.number().integer().positive().required(),
  inviteId: Joi.number().integer().positive().required(),
});

const tokenParam = Joi.object({
  token: Joi.string().trim().hex().length(64).required(),
});

const listQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().allow(''),
}).unknown(false);

const inviteListQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().allow(''),
  status: Joi.string().valid('pending', 'accepted', 'expired', 'canceled', 'declined'),
}).unknown(false);

const create = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(150).required(),
    description: Joi.string().trim().max(5000).allow('', null),
    destination_id: Joi.number().integer().positive(),
    destination_name: Joi.string().trim().min(2).max(200),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().min(Joi.ref('start_date')).required(),
    max_members: Joi.number().integer().min(2).max(500),
    visibility: Joi.string().valid('public', 'private').default('private'),
  }).or('destination_id', 'destination_name'),
};

const updateSettings = {
  params: idParam,
  body: Joi.object({
    name: Joi.string().trim().min(2).max(150),
    description: Joi.string().trim().max(5000).allow('', null),
    destination_id: Joi.number().integer().positive().allow(null),
    destination_name: Joi.string().trim().min(2).max(200).allow('', null),
    start_date: Joi.date().iso(),
    end_date: Joi.date().iso(),
    max_members: Joi.number().integer().min(2).max(500).allow(null),
    visibility: Joi.string().valid('public', 'private'),
  }).min(1),
};

const validateItineraryLocation = (value, helpers, requireComplete) => {
  const hasLocationId = value.location_id !== undefined && value.location_id !== null;
  const hasCustomLocation = value.custom_location !== undefined && value.custom_location !== null && value.custom_location !== '';
  const hasLatitude = value.latitude !== undefined && value.latitude !== null;
  const hasLongitude = value.longitude !== undefined && value.longitude !== null;

  if (hasLocationId && (hasCustomLocation || hasLatitude || hasLongitude)) {
    return helpers.message({ custom: 'location_id cannot be combined with custom_location, latitude, or longitude' });
  }
  if (requireComplete && !hasLocationId && !(hasCustomLocation && hasLatitude && hasLongitude)) {
    return helpers.message({ custom: 'custom_location, latitude, and longitude are required when location_id is not provided' });
  }
  return value;
};

const itineraryFields = {
  itinerary_date: Joi.date().iso().required(),
  start_time: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/).allow(null),
  title: Joi.string().trim().min(2).max(200).required(),
  description: Joi.string().trim().max(5000).allow('', null),
  location_id: Joi.number().integer().positive().allow(null),
  custom_location: Joi.string().trim().max(255).allow('', null),
  latitude: Joi.number().min(-90).max(90).allow(null),
  longitude: Joi.number().min(-180).max(180).allow(null),
  order_index: Joi.number().integer().min(0).default(0),
};

const itineraryBody = Joi.object(itineraryFields)
  .custom((value, helpers) => validateItineraryLocation(value, helpers, true));

const createItineraryItem = { params: idParam, body: itineraryBody };
const updateItineraryItem = {
  params: itineraryParam,
  body: Joi.object(itineraryFields)
    .fork(['itinerary_date', 'title', 'order_index'], (schema) => schema.optional())
    .min(1)
    .custom((value, helpers) => validateItineraryLocation(value, helpers, false)),
};

const changeLeader = {
  params: idParam,
  body: Joi.object({
    user_id: Joi.number().integer().positive().required(),
  }),
};

const invite = {
  params: idParam,
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
  }),
};

module.exports = {
  idParam,
  memberParam,
  itineraryParam,
  inviteIdParam,
  groupInviteParam,
  tokenParam,
  listQuery,
  inviteListQuery,
  create,
  updateSettings,
  createItineraryItem,
  updateItineraryItem,
  changeLeader,
  invite,
};
