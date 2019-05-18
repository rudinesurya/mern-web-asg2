const winston = require('winston');

module.exports = function (err, req, res, next) {
  // console.log(err)
  return res.status(err.output.statusCode).json({ ...err.output.payload, data: err.data });
};
