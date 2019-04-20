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
    user: Joi.objectId(),
    handle: Joi.string().min(3).max(50),
    location: locationSchema,
    bio: Joi.string().min(3).max(50),
  };

  return Joi.validate(input, schema);
};
