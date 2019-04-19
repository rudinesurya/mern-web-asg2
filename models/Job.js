const mongoose = require('mongoose');
const CommentSchema = require('./Comment').Schema;
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
  venue: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
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
