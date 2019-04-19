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
      reject(err);
    }
  });
};

module.exports.getDocByUserId = function (userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Profile.findOne({ user: userId })
        .populate('user', ['name', 'email', 'avatarUrl']);
      if (!doc) return resolve({ error: true, errorMsg: 'Profile not found.' });
      resolve({ doc });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.getDocByHandle = function (handle) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Profile.findOne({ handle })
        .populate('user', ['name', 'email', 'avatarUrl']);
      if (!doc) return resolve({ error: true, errorMsg: 'Profile not found.' });
      resolve({ doc });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.create = function (data) {
  return new Promise(async (resolve, reject) => {
    const { error } = validateRegisteration(data);
    if (error) return resolve({ error, errorMsg: error.details[0].message });
    try {
      const result = await new Profile(data).save();
      resolve({ result });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.updateDocByUserId = function (id, data) {
  return new Promise(async (resolve, reject) => {
    const { error } = validateUpdate(data);
    if (error) return resolve({ error, errorMsg: error.details[0].message });

    try {
      const result = await Profile.findOneAndUpdate({ user: id }, { $set: data }, { new: true });
      resolve({ result });
    } catch (err) {
      reject(err);
    }
  });
};
