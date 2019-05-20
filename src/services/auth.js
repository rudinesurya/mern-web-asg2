const gravatar = require('gravatar');
const Boom = require('@hapi/boom');
const _ = require('lodash');
const User = require('../models/User').Model;
const Profile = require('../models/Profile').Model;
const users = require('./users');
const profiles = require('./profiles');

// Validations
const validateRegisteration = require('./validations/userRegisteration');
const validateLogin = require('./validations/userLogin');

module.exports.registerUser = function (data) {
  return new Promise(async (resolve, reject) => {
    const errors = validateRegisteration(data);
    if (!_.isEmpty(errors)) {
      return reject(Boom.badData('Bad data', errors));
    }

    if (data.password !== data.password2) {
      return reject(Boom.badData('Passwords do not match'));
    }

    const { email } = data;
    const avatarUrl = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    const newUser = new User({
      ...data,
      avatarUrl,
    });

    try {
      const user = await newUser.save();
      const token = await user.generateAuthToken();
      resolve({ token, user });
    } catch (err) {
      if (err.code === 11000) return reject(Boom.conflict('User already exists'));
      reject(Boom.boomify(err));
    }
  });
};

module.exports.loginUser = function (data) {
  return new Promise(async (resolve, reject) => {
    const errors = validateLogin(data);
    if (!_.isEmpty(errors)) {
      return reject(Boom.badData('Bad data', errors));
    }

    try {
      const user = await users.getDocByEmail(data.email);
      if (!user) return reject(Boom.notFound('User not found'));

      const isMatch = await user.comparePassword(data.password);
      if (!isMatch) return reject(Boom.unauthorized('Wrong password'));

      const token = await user.generateAuthToken();
      resolve({ token, user });
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};

module.exports.createProfileIfNew = function (user) {
  return new Promise(async (resolve, reject) => {
    try {
      const profile = await Profile.findOne({ user: user._id });
      if (profile) {
        await profiles.updateDocByUserId(user._id, { lastLogin: Date.now() });
      } else {
        const profileField = {
          handle: user._id.toString(),
        };

        await profiles.create(user._id, profileField);
      }

      resolve();
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};
