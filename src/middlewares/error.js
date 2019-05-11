const winston = require('winston');

module.exports = function (err, req, res) {
  winston.error(err);
  return res.status(err.output.statusCode).json({ ...err.output.payload, data: err.data });
};
