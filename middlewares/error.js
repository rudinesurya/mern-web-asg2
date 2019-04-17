const winston = require('winston');


module.exports = function (err, req, res) {
  winston.error(err);
  res.status(500).json('Internal server error');
};
