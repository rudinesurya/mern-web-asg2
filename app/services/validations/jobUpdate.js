const Joi = require('joi');


module.exports = (input) => {
  const schema = {
    title: Joi.string().min(3).max(50),
    venue: Joi.string().min(3).max(50),
    date: Joi.string().min(3).max(50),
  };

  return Joi.validate(input, schema);
};
