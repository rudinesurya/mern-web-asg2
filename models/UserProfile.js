const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


const UserProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  handle: {
    type: String,
    min: 3,
    max: 50,
    required: true,
  },
  location: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports.Model = mongoose.model('user profiles', UserProfileSchema);

module.exports.validate = (model) => {
  const schema = {
    user: Joi.objectId().required(),
    handle: Joi.string().min(3).max(50).required(),
  };

  return Joi.validate(model, schema);
};
