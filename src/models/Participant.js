const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports.Schema = ParticipantSchema;
