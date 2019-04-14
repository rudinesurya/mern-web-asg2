const validator = require('validator');
const _ = require('lodash');


const registerValidator = (data) => {
  const tdata = data;
  const errors = {};

  tdata.name = !_.isEmpty(tdata.name) ? tdata.name : '';
  tdata.email = !_.isEmpty(tdata.email) ? tdata.email : '';
  tdata.password = !_.isEmpty(tdata.password) ? tdata.password : '';
  tdata.password2 = !_.isEmpty(tdata.password2) ? tdata.password2 : '';

  if (!validator.isLength(tdata.name,
    { min: 3, max: 20 })) errors.name = 'Name must be between 3 and 20 characters';
  if (!validator.isLength(tdata.password,
    { min: 3, max: 10 })) errors.password = 'Password must be at least 3 characters';

  if (!validator.isEmail(tdata.email)) errors.email = 'Email format is invalid';

  if (!validator.isEmpty(tdata.password) && !validator.isEmpty(tdata.password2)) {
    if (!validator.equals(tdata.password, data.password2)) {
      errors.password = 'Passwords must match';
    }
  }

  // highest priority
  if (validator.isEmpty(data.name)) errors.name = 'Name field is required';
  if (validator.isEmpty(data.email)) errors.email = 'Email field is required';
  if (validator.isEmpty(data.password)) errors.password = 'Password field is required';
  if (validator.isEmpty(data.password2)) errors.password2 = 'Confirm Password field is required';

  return {
    errors,
    isValid: _.isEmpty(errors),
  };
};

module.exports = registerValidator;
