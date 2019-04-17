const router = require('express').Router();
const passport = require('passport');
const jobs = require('../../services/jobs');


/**
 * @route   GET api/jobs/
 * @desc    Get all the jobs
 * @access: public
 */
router.get('/', async (req, res) => {
  try {
    const docs = await jobs.getAllDocs();
    res.json(docs);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

/**
 * @route   GET api/jobs/:jobId
 * @desc    Get a job by id
 * @access: public
 */
router.get('/:jobId', async (req, res) => {
  try {
    const doc = await jobs.getDocById(req.params.jobId);
    res.json(doc);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

/**
 * @route   POST api/jobs/
 * @desc    Create a new job
 * @access: private
 */
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const newJob = {
      host: req.user.id,
      title: req.body.title,
      venue: req.body.venue,
      date: req.body.date,
    };

    const result = await jobs.create(newJob);
    res.json(result);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

/**
 * @route   PUT api/jobs/:jobId
 * @desc    Update an existing job
 * @access: private
 */
router.patch('/:jobId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const job = await jobs.getDocById(req.params.jobId);
    if (job.host !== req.user.id) return res.status(401).json('User not authorized to update job.');

    const result = await jobs.updateDoc(req.params.jobId, req.body);
    res.json(result);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

/**
 * @route   DELETE api/jobs/:jobId
 * @desc    Delete an existing job
 * @access: private
 */
router.delete('/:jobId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const job = await jobs.getDocById(req.params.jobId);
    if (job.host !== req.user.id) return res.status(401).json('User not authorized to delete job.');

    const result = await jobs.deleteById(req.params.jobId);
    res.json(result);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

/**
 * @route   POST api/jobs/join/:jobId
 * @desc    Join an existing job
 * @access: private
 */
router.post('/join/:jobId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const job = await jobs.getDocById(req.params.jobId);
    if (job.host === req.user.id) return res.status(405).json('You cannot join your own job.');

    if (job.participants.filter(p => p.user.toString() === req.user.id).length > 0) {
      return res.status(405).json('You are already joined.');
    }

    const result = await jobs.join(req.user.id, req.params.jobId);
    res.json(result);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

/**
 * @route   POST api/jobs/leave/:jobId
 * @desc    Leave an existing job
 * @access: private
 */
router.post('/leave/:jobId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const job = await jobs.getDocById(req.params.jobId);
    if (job.host === req.user.id) return res.status(405).json('You cannot leave your own job.');

    if (job.participants.filter(p => p.user.toString() === req.user.id).length === 0) {
      return res.status(405).json('You have not joined.');
    }

    const result = await jobs.leave(req.user.id, req.params.jobId);
    res.json(result);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

/**
 * @route   POST api/jobs/comment/:jobId
 * @desc    Leave a comment in a job post
 * @access: private
 */
router.post('/comment/:jobId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const result = await jobs.postComment(req.user.id, req.params.jobId, req.body);
      res.json(result);
    }
    catch (err) {
      res.status(400).json(err);
    }
  });

/**
 * @route   DELETE api/jobs/comment/:jobId/:commentId
 * @desc    Delete a comment in a job post
 * @access: private
 */
router.delete('/comment/:jobId/:commentId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const result = await jobs.deleteComment(req.params.jobId, req.params.commentId);
      res.json(result);
    }
    catch (err) {
      res.status(400).json(err);
    }
  });

module.exports = router;
