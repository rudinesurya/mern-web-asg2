const Joi = require('joi');


module.exports = (input) => {
  const schema = {
    user: Joi.objectId().required(),
    handle: Joi.string().min(3).max(50).required(),
    location: Joi.string().min(3).max(50),
    bio: Joi.string().min(3).max(50),
  };

  return Joi.validate(input, schema);
};
