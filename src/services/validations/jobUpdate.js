const Joi = require('joi');

module.exports = (input) => {
  const locationSchema = Joi.object().keys({
    name: Joi.string(),
    location: Joi.object().keys({
      type: Joi.string(),
      coordinates: Joi.array().items(Joi.number()),
    }),
  });

  const schema = {
    title: Joi.string().min(3).max(50),
    payout: Joi.number(),
    venue: locationSchema,
    date: Joi.date(),
    description: Joi.string().min(3),
    urgency: Joi.boolean(),
  };

  const { error } = Joi.validate(input, schema, { abortEarly: false });
  let result = {};
  if (error) {
    result = error.details.reduce((map, obj) => {
      map[obj.path] = obj.message;
      return map;
    }, {});
  }
  return result;
};
