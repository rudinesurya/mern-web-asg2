const validator = require('validator');
const _ = require('lodash');


const loginUserValidator = (data) => {
  const tdata = data;
  const errors = {};

  tdata.email = !_.isEmpty(tdata.email) ? tdata.email : '';
  tdata.password = !_.isEmpty(tdata.password) ? tdata.password : '';

  if (!validator.isLength(tdata.password,
    { min: 3, max: 10 })) errors.password = 'Password must be at least 3 characters';

  if (!validator.isEmail(tdata.email)) errors.email = 'Email format is invalid';

  // highest priority
  if (validator.isEmpty(tdata.email)) errors.email = 'Email field is required';
  if (validator.isEmpty(tdata.password)) errors.password = 'Password field is required';

  return {
    errors,
    isValid: _.isEmpty(errors),
  };
};

module.exports = loginUserValidator;
