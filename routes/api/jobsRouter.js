const router = require('express').Router();
const passport = require('passport');
const Job = require('../../model/Job');
const registerJobValidator = require('../../validators/registerJobValidator');
const postCommentValidator = require('../../validators/postCommentValidator');


/**
 * @route   GET api/jobs/
 * @desc    Get all the jobs
 * @access: public
 */
router.get('/', (req, res) => {
  Job.find().exec().then(docs => res.json({ jobs: docs })).catch((err) => {
    console.log(err);
    res.status(404).json(err);
  });
});

/**
 * @route   GET api/jobs/:jobId
 * @desc    Get a job by id
 * @access: public
 */
router.get('/:jobId', (req, res) => {
  const errors = {};
  const { jobId } = req.params;
  Job.findById(jobId).then((doc) => {
    if (!doc) {
      errors.job = 'No valid entry found for provided id';
      return res.status(404).json(errors);
    }
    res.json({ job: doc });
  }).catch((err) => {
    console.log(err);
    res.status(404).json(err);
  });
});

/**
 * @route   POST api/jobs/
 * @desc    Create a new job
 * @access: private
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = registerJobValidator(req.body);
  if (!isValid) return res.status(400).json(errors);

  const newJob = new Job({
    host: req.user.id,
    title: req.body.title,
    venue: req.body.venue,
    date: req.body.date,
  });

  newJob.save().then(result => res.json(result)).catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

/**
 * @route   PUT api/jobs/:jobId
 * @desc    Update an existing job
 * @access: private
 */
router.patch('/:jobId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  const { jobId } = req.params;

  Job.findById(jobId)
    .then((job) => {
      if (job.host.toString() !== req.user.id) {
        errors.auth = 'User not authorized to delete job.';
        return res.status(401).json(errors);
      }

      // Authorized
      const updateField = {
        updatedDate: Date.now(),
      };
      for (const key in req.body) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) {
          updateField[key] = req.body[key];
        }
      }

      job.update(updateField).then(result => res.json(result));
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

/**
 * @route   DELETE api/jobs/:jobId
 * @desc    Delete an existing job
 * @access: private
 */
router.delete('/:jobId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  const { jobId } = req.params;

  Job.findById(jobId)
    .then((job) => {
      if (job.host.toString() !== req.user.id) {
        errors.auth = 'User not authorized to delete job.';
        return res.status(401).json(errors);
      }

      // Authorized
      job.remove().then(result => res.json(result));
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
});

/**
 * @route   POST api/jobs/join/:jobId
 * @desc    Join an existing job
 * @access: private
 */
router.post('/join/:jobId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  const { jobId } = req.params;

  Job.findById(jobId)
    .then((job) => {
      if (job.host.toString() === req.user.id) {
        errors.join = 'You cannot join your own job.';
        return res.status(405).json(errors);
      }

      if (job.participants.filter(p => p.user.toString() === req.user.id).length > 0) {
        errors.join = 'You are already joined.';
        return res.status(405).json(errors);
      }

      // Able to join
      job.participants.unshift({ user: req.user.id });
      job.save().then(result => res.json(result));
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
});

/**
 * @route   POST api/jobs/leave/:jobId
 * @desc    Leave an existing job
 * @access: private
 */
router.post('/leave/:jobId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  const { jobId } = req.params;

  Job.findById(jobId)
    .then((job) => {
      if (job.host.toString() === req.user.id) {
        errors.join = 'You cannot leave your own job.';
        return res.status(405).json(errors);
      }

      if (job.participants.filter(p => p.user.toString() === req.user.id).length === 0) {
        errors.join = 'You have not joined.';
        return res.status(405).json(errors);
      }

      const index = job.participants
        .map(p => p.user.toString())
        .indexOf(req.user.id);

      // Remove the user from the array
      job.participants.splice(index, 1);
      job.save().then(result => res.json(result));
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
});

/**
 * @route   POST api/jobs/comment/:jobId
 * @desc    Leave a comment in a job post
 * @access: private
 */
router.post('/comment/:jobId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { jobId } = req.params;
  const { errors, isValid } = postCommentValidator(req.body);
  if (!isValid) return res.status(400).json(errors);

  Job.findById(jobId)
    .then((job) => {
      const newComment = {
        user: req.user.id,
        text: req.body.text,
      };

      job.comments.unshift(newComment);
      job.save().then(result => res.json(result));
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
});

/**
 * @route   DELETE api/jobs/comment/:jobId/:commentId
 * @desc    Delete a comment in a job post
 * @access: private
 */
router.delete('/comment/:jobId/:commentId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    const { jobId, commentId } = req.params;

    Job.findById(jobId)
      .then((job) => {
        const theComment = job.comments.find(c => c._id.toString() === commentId);
        if (!theComment) {
          errors.comment = 'Comment does not exist';
          return res.status(404).json(errors);
        }

        const index = job.comments.indexOf(theComment);
        job.comments.splice(index, 1);
        job.save().then(result => res.json(result));
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json(err);
      });
  });

module.exports = router;
