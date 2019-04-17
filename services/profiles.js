const Profile = require('../models/UserProfile').Model;


exports.getAllDocs = function () {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    Profile.find()
      .populate('user', ['name', 'email', 'avatarUrl'])
      .then(docs => resolve(docs))
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getDocById = function (id) {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    Profile.findById(id)
      .populate('user', ['name', 'email', 'avatarUrl'])
      .then((doc) => {
        if (!doc) {
          return reject('No user profile found');
        }

        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getDocByUserId = function (userId) {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    Profile.findOne({ user: userId })
      .populate('user', ['name', 'email', 'avatarUrl'])
      .then((doc) => {
        if (!doc) {
          return reject('No user profile found');
        }

        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getDocByHandle = function (handle) {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    Profile.findOne({ handle })
      .populate('user', ['name', 'email', 'avatarUrl'])
      .then((doc) => {
        if (!doc) {
          return reject('No user profile found');
        }

        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.create = function (data) {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    new Profile(data).save()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
};

exports.updateDoc = function (id, data) {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    Profile.findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
};
