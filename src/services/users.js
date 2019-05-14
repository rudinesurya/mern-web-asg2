const Boom = require('@hapi/boom');
const User = require('../models/User').Model;

module.exports.getDocByEmail = function (email) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await User.findOne({ email });
      resolve(doc);
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};

module.exports.deleteById = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await User.findOneAndRemove({ _id: id });
      resolve(result);
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};
