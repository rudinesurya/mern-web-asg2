const passport = require('passport');
const Boom = require('@hapi/boom');

module.exports = function (req, res, next) {
  return passport.authenticate('jwt', {
    session: false,
  }, (err, user) => {
    if (err || !user) {
      return next(Boom.unauthorized('User is not authenticated'));
    }
    // Forward user information to the next middleware
    const {
      _id, email, name, isAdmin, avatarUrl,
    } = user;
    req.user = {
      _id: _id.toString(), email, name, isAdmin, avatarUrl,
    };
    next();
  })(req, res, next);
};
