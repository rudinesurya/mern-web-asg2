const winston = require('winston');
const morgan = require('morgan');

module.exports = function (app) {
  app.use(morgan('dev'));

  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.txt' }),
  );

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
};
