const Joi = require('joi');


module.exports = (input) => {
  const schema = {
    user: Joi.objectId().required(),
    text: Joi.string().min(3).max(200).required(),
  };

  return Joi.validate(input, schema);
};
