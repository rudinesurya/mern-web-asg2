const router = require('express').Router();
const passport = require('passport');
const auth = require('../../services/auth');
const users = require('../../services/users');
const profiles = require('../../services/profiles');


/**
 * @route:  POST api/users/register
 * @desc:   Register a new user
 * @access: public
 */
router.post('/register', async (req, res) => {
  try {
    const user = await auth.getDocByEmail(req.body.email);
    if (user) return res.status(400).json('email already exists');

    const result = await auth.registerUser(req.body);
    res.json(result);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

/**
 * @route:  POST api/users/login
 * @desc:   Login user
 * @access: public
 */
router.post('/login', async (req, res) => {
  try {
    const user = await auth.getDocByEmail(req.body.email);
    if (!user) return res.status(400).json('email not found');

    const result = await auth.loginUser(user, req.body);

    // Create a user profile if a new user logged in
    const profile = await profiles.getDocByUserId(user._id);
    if (profile) {
      profiles.updateDoc(profile._id, { lastLogin: Date.now() });
    } else {
      const profileField = {
        user: user.id,
        handle: user.id,
      };

      profiles.create(profileField);
    }

    res.json(result);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

/**
 * @route:  GET api/users/current
 * @desc:   Get current user
 * @access: private
 */
router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.json(req.user);
});

/**
 * @route:  DELETE api/users/current
 * @desc:   Delete current user
 * @access: private
 */
router.delete('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const result = await users.deleteById(req.user.id);
    res.json(result);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
