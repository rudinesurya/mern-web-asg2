const router = require('express').Router();
const passport = require('../../middlewares/passport');
const jobs = require('../../services/jobs');

/**
 * @route   GET api/jobs/
 * @desc    Get all the jobs
 * @access: public
 */
router.get('/', async (req, res) => {
  const { docs } = await jobs.getAllDocs();
  res.json(docs);
});

/**
 * @route   GET api/jobs/:jobId
 * @desc    Get a job by id
 * @access: public
 */
router.get('/:jobId', async (req, res) => {
  const { doc } = await jobs.getDocById(req.params.jobId);
  res.json(doc);
});

/**
 * @route   POST api/jobs/
 * @desc    Create a new job
 * @access: private
 */
router.post('/', passport, async (req, res) => {
  const { result } = await jobs.create(req.user._id, req.body);
  res.status(201).json(result);
});

/**
 * @route   PUT api/jobs/:jobId
 * @desc    Update an existing job
 * @access: private
 */
router.patch('/:jobId', passport, async (req, res) => {
  const { result } = await jobs.updateDoc(req.user._id,
    req.params.jobId,
    req.body);
  res.json(result);
});

/**
 * @route   DELETE api/jobs/:jobId
 * @desc    Delete an existing job
 * @access: private
 */
router.delete('/:jobId', passport, async (req, res) => {
  const { result } = await jobs.deleteById(req.params.jobId);
  res.json(result);
});

/**
 * @route   POST api/jobs/join/:jobId
 * @desc    Join an existing job
 * @access: private
 */
router.post('/join/:jobId', passport, async (req, res) => {
  const { result } = await jobs.join(req.user._id, req.params.jobId);
  res.json(result);
});

/**
 * @route   POST api/jobs/leave/:jobId
 * @desc    Leave an existing job
 * @access: private
 */
router.post('/leave/:jobId', passport, async (req, res) => {
  const { result } = await jobs.leave(req.user._id, req.params.jobId);
  res.json(result);
});

/**
 * @route   POST api/jobs/comment/:jobId
 * @desc    Leave a comment in a job post
 * @access: private
 */
router.post('/comment/:jobId', passport, async (req, res) => {
  const { result } = await jobs.postComment(req.user._id,
    req.params.jobId,
    req.body);
  res.json(result);
});

/**
 * @route   DELETE api/jobs/comment/:jobId/:commentId
 * @desc    Delete a comment in a job post
 * @access: private
 */
router.delete('/comment/:jobId/:commentId', passport, async (req, res) => {
  const { result } = await jobs.deleteComment(req.user._id,
    req.params.jobId,
    req.params.commentId);
  res.json(result);
});

module.exports = router;
