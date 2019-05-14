const Boom = require('@hapi/boom');
const _ = require('lodash');
const Profile = require('../models/Profile').Model;

// Validations
const validateRegisteration = require('./validations/profileRegisteration');
const validateUpdate = require('./validations/profileUpdate');

module.exports.getAllDocs = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const docs = await Profile.find()
        .populate('user', ['name', 'email', 'avatarUrl']);
      resolve({ docs });
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};

module.exports.getDocByUserId = function (userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Profile.findOne({ user: userId })
        .populate('user', ['name', 'email', 'avatarUrl']);
      if (!doc) return reject(Boom.notFound('Profile not found'));
      resolve({ doc });
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};

module.exports.getDocByHandle = function (handle) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Profile.findOne({ handle })
        .populate('user', ['name', 'email', 'avatarUrl']);
      if (!doc) return reject(Boom.notFound('Profile not found'));
      resolve({ doc });
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};

module.exports.create = function (id, data) {
  return new Promise(async (resolve, reject) => {
    const errors = validateRegisteration(data);
    if (!_.isEmpty(errors)) {
      return reject(Boom.badData('Bad data', errors));
    }

    const newProfile = {
      user: id,
      ...data,
    };

    try {
      const result = await new Profile(newProfile).save();
      resolve({ result });
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};

module.exports.updateDocByUserId = function (id, data) {
  return new Promise(async (resolve, reject) => {
    console.log(data);
    const errors = validateUpdate(data);
    if (!_.isEmpty(errors)) {
      return reject(Boom.badData('Bad data', errors));
    }

    try {
      const result = await Profile.findOneAndUpdate({ user: id }, { $set: data }, { new: true });
      resolve({ result });
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};
