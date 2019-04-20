const passport = require('passport');


module.exports = function (req, res, next) {
  return passport.authenticate('jwt', {
    session: false,
  }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        status: 'error',
        error: 'unauthenticated',
      });
    }
    // Forward user information to the next middleware
    const { _id, email, name } = user;
    req.user = { _id: _id.toString(), email, name };
    next();
  })(req, res, next);
};
