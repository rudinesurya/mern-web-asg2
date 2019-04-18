const express = require('express');
const config = require('config');
const setupLogging = require('./setup/logging');
const setupRouting = require('./setup/routes');
require('./setup/extras');

const app = express();

setupLogging(app); // Setup logging
setupRouting(app); // Setup routing

// Start the server
const port = config.get('port');
app.listen(port || 3000);
console.log(`Server listening on port ${port}`);


module.exports = app;
