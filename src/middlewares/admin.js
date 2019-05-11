const Boom = require('@hapi/boom');

module.exports = function (req, res, next) {
  if (!req.user.isAdmin) {
    return next(Boom.forbidden('User is not authorized'));
  }
  return next();
};
