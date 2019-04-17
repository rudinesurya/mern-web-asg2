const passport = require('passport');


module.exports = function (req, res, next) {
  return passport.authenticate('jwt', {
    session: false,
  }, (err, user) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        status: 'error',
        error: 'UNAUTHORIZED_USER',
      });
    }
    // Forward user information to the next middleware
    req.user = { ...user, _id: user._id.toString() };
    next();
  })(req, res, next);
};
