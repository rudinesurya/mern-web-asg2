const mongoose = require('mongoose');


const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'Point',
  },
  coordinates: {
    type: [Number],
  },
});

const LocationSchema = new mongoose.Schema({
  name: String,
  location: {
    type: PointSchema,
    required: true,
  },
});

module.exports.Schema = LocationSchema;
