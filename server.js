const express = require('express');
const config = require('config');
const logger = require('morgan');
const db = require('./db/db');
const { assignRoutes } = require('./routes/api/routes');
const passport = require('./auth/passport'); // import passport configured with JWT strategy


db.DBConnectMongoose()
  .then(() => {
    const app = express();

    // Assign middlewares
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(passport.initialize());

    app.get('/ping', (req, res) => {
      res.json('i am working');
    });

    // Assign routes
    assignRoutes(app);

    // Start the server
    const port = config.get('port');
    app.listen(port || 3000);
    console.log(`Server listening on port ${port}`);
  }).catch((err) => {
  console.log(`Error: ${err}`);
});
