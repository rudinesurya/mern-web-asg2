const mongoose = require('mongoose');
const Joi = require('joi');
const CommentSchema = require('./Comment').Schema;

const { Schema } = mongoose;

const JobSchema = new Schema({
  host: {
    type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
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

exports.Model = mongoose.model('jobs', JobSchema);

exports.validate = (model) => {
  const schema = {
    host: Joi.objectId().required(),
    title: Joi.string().min(3).max(50).required(),
    venue: Joi.string().min(3).max(50).required(),
    date: Joi.string().min(3).max(50).required(),
  };

  return Joi.validate(model, schema);
};
