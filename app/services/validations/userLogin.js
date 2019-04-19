const Joi = require('joi');


module.exports = (input) => {
  const schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().min(3).max(50).required(),
  };

  return Joi.validate(input, schema);
};
