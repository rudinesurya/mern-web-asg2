const router = require('express').Router();
const passport = require('../../middlewares/passport');
const admin = require('../../middlewares/admin');
const auth = require('../../services/auth');
const users = require('../../services/users');

/**
 * @route:  POST api/users/
 * @desc:   Register a new user
 * @access: public
 */
router.post('/', async (req, res) => {
  const {
    token, user,
  } = await auth.registerUser(req.body);
  // Create a user profile if a new user logged in
  await auth.createProfileIfNew(user);
  res.status(201).json(token);
});

/**
 * @route:  POST api/users/login
 * @desc:   Login user
 * @access: public
 */
router.post('/login', async (req, res) => {
  const {
    token, user,
  } = await auth.loginUser(req.body);
  // Create a user profile if a new user logged in
  await auth.createProfileIfNew(user);
  res.json(token);
});

/**
 * @route:  GET api/users/current
 * @desc:   Get current user
 * @access: private
 */
router.get('/current', passport, async (req, res) => {
  res.json(req.user);
});

/**
 * @route:  DELETE api/users/current
 * @desc:   Delete current user
 * @access: private
 */
router.delete('/current', passport, async (req, res) => {
  const result = await users.deleteById(req.user._id);
  res.json(result);
});

module.exports = router;

/**
 * @route:  DELETE api/users/:id
 * @desc:   Delete user
 * @access: private, admin only
 */
router.delete('/:id', [passport, admin], async (req, res) => {
  const result = await users.deleteById(req.params.id);
  res.json(result);
});

module.exports = router;
