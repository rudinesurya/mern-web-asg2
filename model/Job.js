const mongoose = require('mongoose');

const { Schema } = mongoose;

// Create Schema
const JobSchema = new Schema({
  host: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  title: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('jobs', JobSchema);
