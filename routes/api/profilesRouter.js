const router = require('express').Router();
const passport = require('passport');
const Profile = require('../../model/UserProfile');
const profileValidator = require('../../validators/profileValidator');


/**
 * @route   GET api/profiles
 * @desc    Get all user profiles
 * @access: public
 */
router.get('/', (req, res) => {
  const errors = {};
  Profile.find()
    .populate('user', ['name', 'email', 'avatarUrl'])
    .then((profiles) => {
      if (!profiles) {
        errors.profile = 'No user profiles found';
        res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
});

/**
 * @route   GET api/profiles/current
 * @desc    Get current user profile if it exists
 * @access: private
 */
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'email', 'avatarUrl'])
    .then((profile) => {
      if (!profile) {
        errors.profile = 'No user profile found';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
});

/**
 * @route   GET api/profiles/:handle
 * @desc    Get user profile by handle if it exists
 * @access: public
 */
router.get('/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'email', 'avatarUrl'])
    .then((profile) => {
      if (!profile) {
        errors.profile = 'No user profile found';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
});

/**
 * @route   POST api/profiles/current
 * @desc    Create or update user profile
 * @access: private
 */
router.post('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = profileValidator(req.body);
  if (!isValid) res.status(400).json(errors);

  const profileField = {};

  profileField.user = req.user.id;
  if (req.body.handle) profileField.handle = req.body.handle;
  if (req.body.location) profileField.location = req.body.location;
  if (req.body.bio) profileField.bio = req.body.bio;

  // Check if profile already exists
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      if (profile) {
        Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileField }, { new: true }).then(
          profile => res.json(profile),
        );
      } else {
        new Profile(profileField).save().then(profile => res.json(profile));
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
});

module.exports = router;
