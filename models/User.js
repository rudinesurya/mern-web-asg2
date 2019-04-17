const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    default: '',
  },

  createdDate: {
    type: Date,
    default: Date.now(),
  },
  lastLogin: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre('save', function (next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  }
});

UserSchema.methods.generateAuthToken = function () {
  return new Promise(async (resolve, reject) => {
    const payload = {
      _id: this._id.toString(),
      name: this.name,
      email: this.email,
    };

    try {
      const token = await jwt.sign(payload, config.get('jwt_secret'), { expiresIn: 36000 });
      resolve(token);
    } catch (err) {
      reject(err);
    }
  });
};

UserSchema.methods.comparePassword = function (password) {
  return new Promise(async (resolve, reject) => {
    try {
      const isMatch = await bcrypt.compare(password, this.password);
      resolve(isMatch);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.Model = mongoose.model('users', UserSchema);

module.exports.validate = (model) => {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(3).max(50).required(),
  };

  return Joi.validate(model, schema);
};
