const mongoose = require('mongoose');
const CommentSchema = require('./Comment').Schema;
const LocationSchema = require('./Location').Schema;
const ParticipantSchema = require('./Participant').Schema;

const JobSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  payout: {
    type: Number,
    required: true,
  },
  venue: {
    type: LocationSchema,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  urgency: {
    type: Boolean,
    default: false,
  },

  participants: [ParticipantSchema],

  comments: [CommentSchema],

  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports.Model = mongoose.model('jobs', JobSchema);
