const Boom = require('@hapi/boom');
const _ = require('lodash');
const Job = require('../models/Job').Model;

// Validations
const validateRegisteration = require('./validations/jobRegisteration');
const validateUpdate = require('./validations/jobUpdate');
const validatePostComment = require('./validations/commentPost');

module.exports.getAllDocs = function (match, sort, limit, skip) {
  return new Promise(async (resolve, reject) => {
    try {
      const docs = await Job.find(match)
        .limit(limit)
        .skip(skip)
        .sort(sort)
        .populate('host', ['name', 'email', 'avatarUrl']);

      resolve(docs);
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};

module.exports.getDocById = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Job.findById(id)
        .populate('host', ['name', 'email', 'avatarUrl'])
        .populate('participants.user', ['name', 'avatarUrl'])
        .populate('comments.user', ['name', 'avatarUrl']);
      if (!doc) return reject(Boom.notFound('Job not found'));
      resolve(doc);
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};

module.exports.create = function (id, data) {
  return new Promise(async (resolve, reject) => {
    const errors = validateRegisteration(data);
    if (!_.isEmpty(errors)) {
      return reject(Boom.badData('Bad data', errors));
    }

    const newJob = {
      host: id,
      ...data,
    };

    try {
      const result = await new Job(newJob).save();
      resolve(result);
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};

module.exports.updateDoc = function (userId, jobId, data) {
  return new Promise(async (resolve, reject) => {
    const errors = validateUpdate(data);
    if (!_.isEmpty(errors)) {
      return reject(Boom.badData('Bad data', errors));
    }

    try {
      const result = await Job.findOneAndUpdate({ _id: jobId, host: userId },
        { $set: data },
        { new: true });
      if (!result) {
        return reject(Boom.notFound('Job not found'));
      }

      resolve(result);
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};

module.exports.deleteById = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Job.findOneAndRemove({ _id: id });
      if (!result) return reject(Boom.notFound('Job not found'));

      resolve(result);
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};

module.exports.join = function (userId, jobId) {
  return new Promise(async (resolve, reject) => {
    try {
      const job = await Job.findById(jobId);
      if (!job) return reject(Boom.notFound('Job not found'));

      // Should not allow the host
      if (job.host.toString() === userId) {
        return reject(Boom.badRequest('Host not allowed to join'));
      }

      // Should not join more than once
      if (job.participants.filter(p => p.user.toString() === userId).length > 0) {
        return reject(Boom.badRequest('You are already enlisted'));
      }

      // Add the user
      const newParticipant = {
        user: userId.toString(),
      };

      job.participants.unshift(newParticipant);
      const result = await job.save();
      resolve(result);
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};

module.exports.leave = function (userId, jobId) {
  return new Promise(async (resolve, reject) => {
    try {
      const job = await Job.findById(jobId);
      if (!job) return reject(Boom.notFound('Job not found'));

      // Should not allow the host
      if (job.host.toString() === userId) {
        return reject(Boom.badRequest('Host not allowed to leave'));
      }

      // Should not leave an un-joined job
      if (job.participants.filter(p => p.user.toString() === userId).length === 0) {
        return reject(Boom.badRequest('You are not enlisted'));
      }

      // Remove the user
      const index = job.participants.indexOf(userId);

      // Remove the user from the array
      job.participants.splice(index, 1);

      const result = await job.save();
      resolve(result);
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};

module.exports.postComment = function (userId, jobId, data) {
  return new Promise(async (resolve, reject) => {
    const errors = validatePostComment(data);
    if (!_.isEmpty(errors)) {
      return reject(Boom.badData('Bad data', errors));
    }

    const newComment = {
      user: userId.toString(),
      text: data.text,
    };

    try {
      const job = await Job.findById(jobId);
      if (!job) return reject(Boom.notFound('Job not found'));

      job.comments.unshift(newComment);
      const result = await job.save();
      resolve(result);
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};

module.exports.deleteComment = function (userId, jobId, commentId) {
  return new Promise(async (resolve, reject) => {
    try {
      const job = await Job.findById(jobId);
      if (!job) return reject(Boom.notFound('Job not found'));

      const theComment = job.comments.find(c => c._id.toString() === commentId);
      if (!theComment) {
        return reject(Boom.notFound('Comment not found'));
      }

      if (theComment.user.toString() !== userId) {
        return reject(Boom.forbidden('Unable to remove comment'));
      }

      const index = job.comments.indexOf(theComment);
      job.comments.splice(index, 1);

      const result = await job.save();
      resolve(result);
    } catch (err) {
      reject(Boom.boomify(err));
    }
  });
};
