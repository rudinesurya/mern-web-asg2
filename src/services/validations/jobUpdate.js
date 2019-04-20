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
    venue: locationSchema.required(),
    date: Joi.date(),
  };

  return Joi.validate(input, schema);
};
