const validator = require('validator');
const _ = require('lodash');


const registerValidator = data => {
    let errors = {};

    data.name = !_.isEmpty(data.name) ? data.name : '';
    data.email = !_.isEmpty(data.email) ? data.email : '';
    data.password = !_.isEmpty(data.password) ? data.password : '';
    data.password2 = !_.isEmpty(data.password2) ? data.password2 : '';

    if (!validator.isLength(data.name, {min: 4, max: 20}))
        errors.name = 'Name must be between 4 and 20 characters';
    if (!validator.isLength(data.password, {min: 6, max: 10}))
        errors.password = 'Password must be at least 6 characters';

    if (!validator.isEmail(data.email))
        errors.email = 'Email format is invalid';

    if (!validator.isEmpty(data.password) && !validator.isEmpty(data.password2)) {
        if (!validator.equals(data.password, data.password2)) {
            errors.password = 'Passwords must match';
        }
    }

    //highest priority
    if (validator.isEmpty(data.name))
        errors.name = 'Name field is required';
    if (validator.isEmpty(data.email))
        errors.email = 'Email field is required';
    if (validator.isEmpty(data.password))
        errors.password = 'Password field is required';
    if (validator.isEmpty(data.password2))
        errors.password2 = 'Confirm Password field is required';

    return {
        errors,
        isValid: _.isEmpty(errors)
    };
};

module.exports = registerValidator;