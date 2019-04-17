const Joi = require('joi');
const Profile = require('../models/UserProfile').Model;


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

module.exports.getDocById = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Profile.findById(id)
        .populate('user', ['name', 'email', 'avatarUrl']);
      resolve({ doc });
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
      resolve({ doc });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.create = function (data) {
  return new Promise(async (resolve, reject) => {
    const { error } = validate(data);
    if (error) return resolve({ error, errorMsg: error.details[0].message });

    try {
      const result = await new Profile(data).save();
      resolve({ result });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.updateDoc = function (id, data) {
  return new Promise(async (resolve, reject) => {
    const { error } = validate(data);
    if (error) return resolve({ error, errorMsg: error.details[0].message });

    try {
      const result = await Profile.findOneAndUpdate({ _id: id }, { $set: data }, { new: true });
      resolve({ result });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.updateDocByUserId = function (id, data) {
  return new Promise(async (resolve, reject) => {
    const { error } = validate(data);
    if (error) return resolve({ error, errorMsg: error.details[0].message });

    try {
      const result = await Profile.findOneAndUpdate({ user: id }, { $set: data }, { new: true });
      resolve({ result });
    } catch (err) {
      reject(err);
    }
  });
};

// Validators
const validate = (changes) => {
  const schema = {
    handle: Joi.string().min(3).max(50),
    location: Joi.string().min(3).max(50),
    bio: Joi.string().min(3).max(50),
  };

  return Joi.validate(changes, schema);
};
