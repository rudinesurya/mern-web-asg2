const mongoose = require('mongoose');
const Joi = require('joi');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  text: {
    type: String,
    required: true,
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

exports.Schema = CommentSchema;

exports.validate = (model) => {
  const schema = {
    user: Joi.objectId().required(),
    text: Joi.string().min(3).max(200).required(),
  };

  return Joi.validate(model, schema);
};
