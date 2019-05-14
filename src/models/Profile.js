const mongoose = require('mongoose');
const LocationSchema = require('./Location').Schema;

const ProfileSchema = new mongoose.Schema({
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
    type: LocationSchema,
  },
  bio: {
    type: String,
  },
  lastLogin: {
    type: Date,
    default: Date.now(),
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

module.exports.Model = mongoose.model('profiles', ProfileSchema);
