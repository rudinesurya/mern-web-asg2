const Joi = require('joi');


module.exports = (input) => {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().min(3).max(50).required(),
    password2: Joi.string().min(3).max(50).required(),
    isAdmin: Joi.boolean(),
  };

  return Joi.validate(input, schema);
};
