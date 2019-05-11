const passport = require('passport');
const Boom = require('@hapi/boom');

module.exports = function (req, res, next) {
  return passport.authenticate('jwt', {
    session: false,
  }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(Boom.unauthorized('User is not authenticated'));
    }
    // Forward user information to the next middleware
    const {
      _id, email, name, isAdmin,
    } = user;
    req.user = {
      _id: _id.toString(), email, name, isAdmin,
    };
    next();
  })(req, res, next);
};
