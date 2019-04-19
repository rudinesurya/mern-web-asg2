const express = require('express');
const config = require('config');
const db = require('./setup/db');
const setupLogging = require('./setup/logging');
const setupRouting = require('./setup/routes');
require('./setup/extras');

const app = express();

setupLogging(app); // Setup logging
setupRouting(app); // Setup routing

// Connect to DB
db.DBConnectMongoose()
  .then(() => {
    const port = config.get('port');
    app.listen(port || 3000); // Start the server
    console.log(`Server listening on port ${port}`);
  })
  .catch(err => console.log(`Error: ${err}`));

module.exports = app;
