const Joi = require('joi');

const parseRequestSchema = Joi.object({
  travel_request: Joi.string().trim().min(10).max(1000).required(),
});

const recommendationSchema = Joi.object({
  cust_segment: Joi.string()
    .valid('Student', 'Young Professional', 'Family', 'Corporate')
    .required(),

  tour_type: Joi.string()
    .valid('Beach', 'Cultural', 'Adventure', 'City Break')
    .required(),

  pax: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .required(),

  budget_per_person_vnd: Joi.number()
    .integer()
    .positive()
    .required(),
});

module.exports = {
  parseRequestSchema,
  recommendationSchema,
};
