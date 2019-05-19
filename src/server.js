const express = require('express');
const config = require('config');
const cors = require('cors');
require('newrelic');
const db = require('./setup/db');
const setupLogging = require('./setup/logging');
const setupRouting = require('./setup/routes');
require('./setup/extras');

const app = express();
app.use(cors());

setupLogging(app); // Setup logging
setupRouting(app); // Setup routing

// Connect to DB
db.DBConnectMongoose()
  .then(() => {
    const port = process.env.PORT || config.get('port') || 3000;
    app.listen(port); // Start the server
    console.log(`Server listening on port ${port}`);
  })
  .catch(err => console.log(`Error: ${err}`));

module.exports = app;
