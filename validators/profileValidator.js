const validator = require('validator');
const _ = require('lodash');


const profileValidator = (data) => {
  const tdata = data;
  const errors = {};

  tdata.handle = !_.isEmpty(tdata.handle) ? tdata.handle : '';
  tdata.location = !_.isEmpty(tdata.location) ? tdata.location : '';
  tdata.bio = !_.isEmpty(tdata.bio) ? tdata.bio : '';

  if (!validator.isLength(tdata.handle,
    { min: 3, max: 50 })) errors.handle = 'Handle must be at least 3 characters';
  if (!validator.isLength(tdata.bio,
    { min: 3, max: 50 })) errors.bio = 'Bio must be at least 3 characters';

  // highest priority
  if (validator.isEmpty(tdata.handle)) errors.handle = 'Handle field is required';
  if (validator.isEmpty(tdata.location)) errors.location = 'Location field is required';
  if (validator.isEmpty(tdata.bio)) errors.bio = 'Bio field is required';

  return {
    errors,
    isValid: _.isEmpty(errors),
  };
};

module.exports = profileValidator;
