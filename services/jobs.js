const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Job = require('../models/Job').Model;


module.exports.getAllDocs = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const docs = await Job.find();
      resolve({ docs });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.getDocById = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Job.findById(id);
      if (!doc) return resolve({ error: true, errorMsg: 'Job not found.' });
      resolve({ doc });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.getDocByHandle = function (handle) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Job.findOne({ handle });
      if (!doc) return resolve({ error: true, errorMsg: 'Job not found.' });
      resolve({ doc });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.create = function (id, data) {
  return new Promise(async (resolve, reject) => {
    const newJob = {
      host: id,
      title: data.title,
      venue: data.venue,
      date: data.date,
    };
    const { error } = validateRegisteration(newJob);
    if (error) return resolve({ error, errorMsg: error.details[0].message });

    try {
      const result = await new Job(newJob).save();
      resolve({ result });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.updateDoc = function (userId, jobId, data) {
  return new Promise(async (resolve, reject) => {
    const { error } = validateUpdate(data);
    if (error) return resolve({ error, errorMsg: error.details[0].message });

    try {
      const result = await Job.findOneAndUpdate({ _id: jobId, host: userId },
        { $set: data },
        { new: true });
      if (!result) {
        return resolve({ error: true, errorMsg: 'Failed to update job.' });
      }

      resolve({ result });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.deleteById = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Job.findOneAndRemove({ _id: id });
      resolve({ result });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.join = function (userId, jobId) {
  return new Promise(async (resolve, reject) => {
    try {
      const job = await Job.findById(jobId);
      // Should not allow the host
      if (job.host.toString() === userId) {
        return resolve({
          error: true,
          errorMsg: 'Unable to join own job.',
        });
      }
      // Should not join more than once
      if (job.participants.filter(p => p.user.toString() === userId).length > 0) {
        return resolve({ error: true, errorMsg: 'You are already joined.' });
      }

      // Add the user
      job.participants.unshift({ user: userId });
      const result = await job.save();
      resolve({ result });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.leave = function (userId, jobId) {
  return new Promise(async (resolve, reject) => {
    try {
      const job = await Job.findById(jobId);
      // Should not allow the host
      if (job.host.toString() === userId) {
        return resolve({
          error: true,
          errorMsg: 'Unable to leave own job.',
        });
      }
      // Should not leave an un-joined job
      if (job.participants.filter(p => p.user.toString() === userId).length === 0) {
        return resolve({ error: true, errorMsg: 'You are not joined.' });
      }

      // Remove the user
      const index = job.participants.indexOf(userId);

      // Remove the user from the array
      job.participants.splice(index, 1);

      const result = await job.save();
      resolve({ result });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.postComment = function (userId, jobId, data) {
  return new Promise(async (resolve, reject) => {
    const newComment = {
      user: userId,
      text: data.text,
    };

    const { error } = validatePostComment(newComment);
    if (error) return resolve({ error, errorMsg: error.details[0].message });

    try {
      const job = await Job.findById(jobId);
      job.comments.unshift(newComment);
      const result = await job.save();
      resolve({ result });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.deleteComment = function (userId, jobId, commentId) {
  return new Promise(async (resolve, reject) => {
    try {
      const job = await Job.findById(jobId);

      const theComment = job.comments.find(c => c._id.toString() === commentId);
      if (!theComment) {
        return resolve({ error: true, errorMsg: 'Comment not found.' });
      }

      if (theComment.user.toString() !== userId) {
        return resolve({
          error: true,
          errorMsg: 'User not authorized to remove comment.',
        });
      }

      const index = job.comments.indexOf(theComment);
      job.comments.splice(index, 1);

      const result = await job.save();
      resolve({ result });
    } catch (err) {
      reject(err);
    }
  });
};

// Validators
const validateRegisteration = require('../models/Job').validate;

const validatePostComment = require('../models/Comment').validate;

const validateUpdate = (changes) => {
  const schema = {
    title: Joi.string().min(3).max(50),
    venue: Joi.string().min(3).max(50),
    date: Joi.string().min(3).max(50),
  };

  return Joi.validate(changes, schema);
};
