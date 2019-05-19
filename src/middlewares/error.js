const winston = require('winston');
const Boom = require('@hapi/boom');

module.exports = function (err, req, res, next) {
  if (Boom.isBoom(err)) {
    if (process.env.NODE_ENV !== 'test') {
      winston.error(err);
    }
    return res.status(err.output.statusCode).json({ ...err.output.payload, data: err.data });
  }
};
