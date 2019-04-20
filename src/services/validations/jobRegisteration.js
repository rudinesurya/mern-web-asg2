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
    host: Joi.objectId().required(),
    title: Joi.string().min(3).max(50).required(),
    venue: locationSchema.required(),
    date: Joi.date().required(),
  };

  return Joi.validate(input, schema);
};
