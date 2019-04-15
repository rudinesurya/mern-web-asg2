const validator = require('validator');
const _ = require('lodash');


const postCommentValidator = (data) => {
  const tdata = data;
  const errors = {};

  tdata.text = !_.isEmpty(tdata.text) ? tdata.text : '';

  // highest priority
  if (validator.isEmpty(tdata.text)) errors.text = 'Text field is required';

  return {
    errors,
    isValid: _.isEmpty(errors),
  };
};

module.exports = postCommentValidator;
