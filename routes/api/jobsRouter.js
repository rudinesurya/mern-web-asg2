const router = require('express').Router();
const passport = require('passport');
const Job = require('../../model/Job');


/**
 * @route   GET api/jobs/
 * @desc    Get all the jobs
 * @access: public
 */
router.get('/', (req, res) => {
  Job.find().exec().then(docs => res.json({ jobs: docs })).catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

/**
 * @route   GET api/jobs/:id
 * @desc    Get a job by id
 * @access: public
 */
router.get('/:jobId', (req, res) => {
  const errors = {};
  const { jobId } = req.params;
  Job.findById(jobId).then((doc) => {
    if (doc) {
      res.json({ job: doc });
    } else {
      errors.job = 'No valid entry found for provided id';
      res.status(404).json(errors);
    }
  }).catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

/**
 * @route   POST api/jobs/
 * @desc    Create a new job
 * @access: private
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
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
 * @route   PUT api/jobs/:id
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
        res.status(401).json(errors);
      }

      // Authorized
      const updateField = {};
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
 * @route   DELETE api/jobs/:id
 * @desc    Delete an existing job
 * @access: private
 */
router.delete('/:jobId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  const { jobId } = req.params;

  Job.findById(jobId)
    .then((job) => {
      console.log(jobId);
      if (job.host.toString() !== req.user.id) {
        errors.auth = 'User not authorized to delete job.';
        res.status(401).json(errors);
      }

      // Authorized
      job.remove().then(result => res.json(result));
      // job.remove().then(result => res.json(result));
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
