const router = require('express').Router();
const passport = require('../../middlewares/passport');
const profiles = require('../../services/profiles');

/**
 * @route   GET api/profiles
 * @desc    Get all user profiles
 * @access: public
 */
router.get('/', async (req, res) => {
  const { docs } = await profiles.getAllDocs();
  res.json(docs);
});

/**
 * @route   POST api/profiles
 * @desc    Create a new user profile
 * @access: admin
 */
router.post('/', async (req, res) => {
  const { result } = await profiles.create(req.body);
  res.status(201).json(result);
});

/**
 * @route   GET api/profiles/current
 * @desc    Get current user profile if it exists
 * @access: private
 */
router.get('/current', passport, async (req, res) => {
  const { doc } = await profiles.getDocByUserId(req.user._id);
  res.json(doc);
});

/**
 * @route   GET api/profiles/:handle
 * @desc    Get user profile by handle if it exists
 * @access: public
 */
router.get('/:handle', async (req, res) => {
  const { doc } = await profiles.getDocByHandle(req.params.handle);
  res.json(doc);
});

/**
 * @route   POST api/profiles/current
 * @desc    Create or update user profile
 * @access: private
 */
router.post('/current', passport, async (req, res) => {
  const { result } = await profiles.updateDocByUserId(req.user._id, req.body);
  res.json(result);
});

module.exports = router;
