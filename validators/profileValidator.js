const validator = require('validator');
const _ = require('lodash');


const profileValidator = data => {
    let errors = {};

    data.handle = !_.isEmpty(data.handle) ? data.handle : '';
    data.location = !_.isEmpty(data.location) ? data.location : '';
    data.bio = !_.isEmpty(data.bio) ? data.bio : '';

    if (!validator.isLength(data.handle, {min: 3, max: 50}))
        errors.handle = 'Handle must be at least 3 characters';
    if (!validator.isLength(data.bio, {min: 3, max: 50}))
        errors.bio = 'Bio must be at least 3 characters';

    //highest priority
    if (validator.isEmpty(data.handle))
        errors.handle = 'Handle field is required';
    if (validator.isEmpty(data.location))
        errors.location = 'Location field is required';
    if (validator.isEmpty(data.bio))
        errors.bio = 'Bio field is required';

    return {
        errors,
        isValid: _.isEmpty(errors)
    };
};

module.exports = profileValidator;