const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User').Model;

const secret = config.get('jwt_secret');


exports.registerUser = function (data) {
  return new Promise((resolve, reject) => {
    const { name, email, password } = data;
    // Validate


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

    // Save this user
    newUser.save()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
};

exports.loginUser = function (user, data) {
  return new Promise((resolve, reject) => {
    // Validate

    // Check password
    user.comparePassword(data.password)
      .then((isMatch) => {
        if (!isMatch) {
          return reject('Authentication failed. Wrong password.');
        }

        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
        };

        jwt.sign(payload, secret, { expiresIn: 36000 }, (err, token) => {
          if (err) return reject(err);

          resolve({
            success: true,
            token: `BEARER ${token}`,
          });
        });
      })
      .catch(err => reject(err));
  });
};

exports.getDocByEmail = function (email) {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    User.findOne({ email })
      .then(doc => resolve(doc))
      .catch(err => reject(err));
  });
};
