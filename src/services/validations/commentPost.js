const Joi = require('joi');

module.exports = (input) => {
  const schema = {
    text: Joi.string().min(3).max(200).required(),
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
