const mongoose = require('mongoose');
const Joi = require('joi');


const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
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

module.exports.Schema = CommentSchema;

module.exports.validate = (model) => {
  const schema = {
    user: Joi.objectId().required(),
    text: Joi.string().min(3).max(200).required(),
  };

  return Joi.validate(model, schema);
};
