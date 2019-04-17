const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const CommentSchema = require('./Comment').Schema;


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

  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
    },
  ],

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

module.exports.validate = (model) => {
  const schema = {
    host: Joi.objectId().required(),
    title: Joi.string().min(3).max(50).required(),
    venue: Joi.string().min(3).max(50).required(),
    date: Joi.string().min(3).max(50).required(),
  };

  return Joi.validate(model, schema);
};
