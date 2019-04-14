const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const User = require('../../model/User');
const Profile = require('../../model/UserProfile');
const registerValidator = require('../../validators/registerValidator');
const loginValidator = require('../../validators/loginValidator');

const { SECRET } = process.env;


/**
 * @route:  POST api/users/register
 * @desc:   Register a new user
 * @access: public
 */
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const { errors, isValid } = registerValidator(req.body);
  if (!isValid) res.status(400).json(errors);

  User.findOne({ email }).then((user) => {
    if (user) {
      errors.email = 'Email already exists';
      res.status(400).json(errors);
    } else {
      const avatarUrl = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      const newUser = new User({
        name,
        email,
        password,
        avatarUrl,
      });

      // Save this user
      newUser
        .save()
        .then(user => res.json(user))
        .catch((err) => {
          console.log(err);
          res.json(err);
        });
    }
  });
});

/**
 * @route:  POST api/users/login
 * @desc:   Login user
 * @access: public
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const { errors, isValid } = loginValidator(req.body);
  if (!isValid) res.status(400).json(errors);

  User.findOne({ email }).then((user) => {
    if (!user) {
      errors.email = 'Authentication failed. User not found.';
      res.status(401).json(errors);
    }

    // Check password
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        console.log(err);
        res.status(401).json(err);
      }
      if (isMatch) {
        // Create the payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        jwt.sign(payload, SECRET, { expiresIn: 3600 }, (err, token) => {
          // Check if profile already exists
          const profileField = {
            user: user.id,
            handle: user.id,
            lastLogin: Date.now(),
          };
          Profile.findOne({ user: user.id }).then((profile) => {
            if (profile) {
              Profile.findOneAndUpdate({ user: user.id }, { $set: profileField }, { new: true });
            } else {
              new Profile(profileField).save();
            }

            res.json({
              success: true,
              token: `BEARER ${token}`,
            });
          });
        });
      } else {
        errors.password = 'Authentication failed. Wrong password.';
        res.status(401).json(errors);
      }
    });
  });
});

/**
 * @route:  GET api/users/current
 * @desc:   Get current user
 * @access: private
 */
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id, email } = req.user;
  res.json({
    id,
    email,
  });
});

/**
 * @route:  DELETE api/users/current
 * @desc:   Delete current user
 * @access: private
 */
router.delete('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.user;
  User.findOneAndRemove({ _id: id })
    .then(() => Profile.findOneAndRemove({ user: id }))
    .then(() => res.json({ success: true }));
});

module.exports = router;
