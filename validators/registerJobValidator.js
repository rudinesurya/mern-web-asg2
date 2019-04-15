const validator = require('validator');
const _ = require('lodash');


const registerJobValidator = (data) => {
  const tdata = data;
  const errors = {};

  tdata.title = !_.isEmpty(tdata.title) ? tdata.title : '';
  tdata.venue = !_.isEmpty(tdata.venue) ? tdata.venue : '';
  tdata.date = !_.isEmpty(tdata.date) ? tdata.date : '';

  // highest priority
  if (validator.isEmpty(tdata.title)) errors.title = 'Title field is required';
  if (validator.isEmpty(tdata.venue)) errors.venue = 'Venue field is required';
  if (validator.isEmpty(tdata.date)) errors.date = 'Date field is required';

  return {
    errors,
    isValid: _.isEmpty(errors),
  };
};

module.exports = registerJobValidator;
