const validator = require('validator');
const _ = require('lodash');


const loginValidator = data => {
    let errors = {};

    data.email = !_.isEmpty(data.email) ? data.email : '';
    data.password = !_.isEmpty(data.password) ? data.password : '';

    if (!validator.isLength(data.password, {min: 6, max: 10}))
        errors.password = 'Password must be at least 6 characters';

    if (!validator.isEmail(data.email))
        errors.email = 'Email format is invalid';

    //highest priority
    if (validator.isEmpty(data.email))
        errors.email = 'Email field is required';
    if (validator.isEmpty(data.password))
        errors.password = 'Password field is required';

    return {
        errors,
        isValid: _.isEmpty(errors)
    };
};

module.exports = loginValidator;