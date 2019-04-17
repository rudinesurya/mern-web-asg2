const winston = require('winston');
const router = require('express').Router();
const passport = require('../../middlewares/passport');
const auth = require('../../services/auth');
const users = require('../../services/users');


/**
 * @route:  POST api/users/
 * @desc:   Register a new user
 * @access: public
 */
router.post('/', async (req, res) => {
  const { token, user, error, errorMsg } = await auth.registerUser(req.body);

  if (error) return res.status(400).json(errorMsg);
  res.json(user);
});

/**
 * @route:  POST api/users/login
 * @desc:   Login user
 * @access: public
 */
router.post('/login', async (req, res) => {
  const { token, user } = await auth.loginUser(req.body);
  // Create a user profile if a new user logged in
  auth.createProfileIfNew(user);
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
  const { result } = await users.deleteById(req.user._id);
  res.json(result);
});

module.exports = router;
