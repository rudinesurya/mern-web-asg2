const Job = require('../models/Job').Model;


exports.getAllDocs = function () {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    Job.find()
      .then(docs => resolve(docs))
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getDocById = function (id) {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    Job.findById(id)
      .then((doc) => {
        if (!doc) {
          return reject('No job found');
        }

        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getDocByHandle = function (handle) {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    Job.findOne({ handle })
      .then((doc) => {
        if (!doc) {
          return reject('No job found');
        }

        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.create = function (data) {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    new Job(data).save()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
};

exports.updateDoc = function (id, data) {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    Job.findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
};

exports.deleteById = function (id) {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    Job.findOneAndRemove({ _id: id })
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
};

exports.join = function (userId, jobId) {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    Job.findById(jobId)
      .then((job) => {
        job.participants.unshift({ user: userId });
        job.save().then(result => resolve(result));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.leave = function (userId, jobId) {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    Job.findById(jobId)
      .then((job) => {
        const index = job.participants
          .map(p => p.user.toString())
          .indexOf(userId);

        // Remove the user from the array
        job.participants.splice(index, 1);
        job.save().then(result => resolve(result));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.postComment = function (userId, jobId, data) {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    Job.findById(jobId)
      .then((job) => {
        const newComment = {
          user: userId,
          text: data.text,
        };

        job.comments.unshift(newComment);
        job.save().then(result => resolve(result));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.deleteComment = function (jobId, commentId) {
  return new Promise((resolve, reject) => {
    // Validate

    // Execute
    Job.findById(jobId)
      .then((job) => {
        const theComment = job.comments.find(c => c._id.toString() === commentId);
        if (!theComment) {
          return reject('Comment does not exist');
        }

        const index = job.comments.indexOf(theComment);
        job.comments.splice(index, 1);
        job.save().then(result => resolve(result));
      })
      .catch((err) => {
        reject(err);
      });
  });
};
