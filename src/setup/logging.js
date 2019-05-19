const winston = require('winston');
const morgan = require('morgan');

module.exports = function (app) {
  app.use(morgan('dev'));

  const console = new winston.transports.Console({ colorize: true, prettyPrint: true });
  const files = new winston.transports.File({ filename: 'log.log' });

  winston.add(console);
  winston.add(files);

  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.txt' }),
  );

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
};
