const Joi = require('joi');


module.exports = (input) => {
  const schema = {
    host: Joi.objectId().required(),
    title: Joi.string().min(3).max(50).required(),
    venue: Joi.string().min(3).max(50).required(),
    date: Joi.string().min(3).max(50).required(),
  };

  return Joi.validate(input, schema);
};
