const router = require('express').Router();
const passport = require('passport');
const profiles = require('../../services/profiles');


/**
 * @route   GET api/profiles
 * @desc    Get all user profiles
 * @access: public
 */
router.get('/', async (req, res) => {
  try {
    const docs = await profiles.getAllDocs();
    res.json(docs);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

/**
 * @route   GET api/profiles/current
 * @desc    Get current user profile if it exists
 * @access: private
 */
router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const doc = await profiles.getDocByUserId(req.user.id);
    res.json(doc);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

/**
 * @route   GET api/profiles/:handle
 * @desc    Get user profile by handle if it exists
 * @access: public
 */
router.get('/:handle', async (req, res) => {
  try {
    const doc = await profiles.getDocByHandle(req.params.handle);
    res.json(doc);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

/**
 * @route   POST api/profiles/current
 * @desc    Create or update user profile
 * @access: private
 */
router.post('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    // The payload
    const profileField = {};
    if (req.body.handle) profileField.handle = req.body.handle;
    if (req.body.location) profileField.location = req.body.location;
    if (req.body.bio) profileField.bio = req.body.bio;

    // Check if the profile already exists
    const profile = await profiles.getDocByUserId(req.user._id);
    if (profile) {
      profileField.updatedDate = Date.now();
      profiles.updateDoc(profile._id, profileField);
    } else {
      profileField.user = req.user.id;
      if (!profileField.handle) profileField.handle = req.user.id;

      profiles.create(profileField);
    }

    const result = await profiles.updateDoc(req.body);
    res.json(result);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
