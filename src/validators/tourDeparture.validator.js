const Joi = require('joi');
const id = Joi.number().integer().positive().required();
const statuses = ['draft', 'open', 'closed', 'sold_out', 'cancelled', 'departed'];
const body = {
  departure_at: Joi.date().iso().required(),
  capacity: Joi.number().integer().min(1),
  price: Joi.number().min(0),
  child_price: Joi.number().min(0),
  infant_price: Joi.number().min(0),
  currency: Joi.string().uppercase().length(3),
  booking_open_at: Joi.date().iso().allow(null),
  booking_close_at: Joi.date().iso().allow(null),
  status: Joi.string().valid(...statuses),
};
module.exports = {
  list: { params: Joi.object({ tourId: id }), query: Joi.object({ page: Joi.number().integer().min(1).default(1), limit: Joi.number().integer().min(1).max(100).default(10), search: Joi.string().trim().max(100).allow(''), status: Joi.string().valid(...statuses), date_from: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/), date_to: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/) }) },
  publicList: { params: Joi.object({ id }) },
  create: { params: Joi.object({ tourId: id }), body: Joi.object(body).required() },
  bulkCreate: { params: Joi.object({ tourId: id }), body: Joi.object({
    start_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    end_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    weekdays: Joi.array().items(Joi.number().integer().min(0).max(6)).min(1).unique().required(),
    departure_time: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).required(),
    capacity: Joi.number().integer().min(1), price: Joi.number().min(0), child_price: Joi.number().min(0), infant_price: Joi.number().min(0),
    currency: Joi.string().uppercase().length(3), booking_open_at: Joi.date().iso().allow(null),
    booking_close_hours_before: Joi.number().min(0).max(8760).allow(null), status: Joi.string().valid('draft', 'open', 'closed'),
  }).required() },
  update: { params: Joi.object({ tourId: id, departureId: id }), body: Joi.object({ ...body, departure_at: Joi.date().iso() }).min(1) },
  remove: { params: Joi.object({ tourId: id, departureId: id }) },
};
