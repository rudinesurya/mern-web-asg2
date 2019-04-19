const gravatar = require('gravatar');

const User = require('../models/User').Model;
const users = require('./users');
const profiles = require('./profiles');

// Validations
const validateRegisteration = require('./validations/userRegisteration');
const validateLogin = require('./validations/userLogin');


module.exports.registerUser = function (data) {
  return new Promise(async (resolve, reject) => {
    const { error } = validateRegisteration(data);
    if (error) return resolve({ error, errorMsg: error.details[0].message });

    const { name, email, password } = data;
    const avatarUrl = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    const newUser = new User({
      name,
      email,
      password,
      avatarUrl,
    });

    try {
      const user = await newUser.save();
      const token = await user.generateAuthToken();
      resolve({ user, token });
    } catch (err) {
      if (err.code === 11000) return resolve({ error: err, errorMsg: err.message });
      reject(err);
    }
  });
};

module.exports.loginUser = function (data) {
  return new Promise(async (resolve, reject) => {
    const { error } = validateLogin(data);
    if (error) return resolve({ error, errorMsg: error.details[0].message });

    try {
      const { doc: user } = await users.getDocByEmail(data.email);
      if (!user) return resolve({ error: true, errorMsg: 'User not found.' });

      const isMatch = await user.comparePassword(data.password);
      if (!isMatch) return resolve({ error: true, errorMsg: 'Wrong Password.' });

      const token = await user.generateAuthToken();
      resolve({ token, user });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.createProfileIfNew = function (user) {
  return new Promise(async (resolve, reject) => {
    try {
      const { doc: profile } = await profiles.getDocByUserId(user._id);

      if (profile) {
        await profiles.updateDocByUserId(user._id, { lastLogin: Date.now() });
      } else {
        const profileField = {
          user: user._id.toString(),
          handle: user._id.toString(),
        };

        await profiles.create(profileField);
      }

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
