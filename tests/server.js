const express = require('express');
const config = require('config');
require('../setup/extras');
const mongoose = require('mongoose');
const { Mockgoose } = require('mockgoose');
const setupRouting = require('../setup/routes');
const db = require('../setup/db');

const mockgoose = new Mockgoose(mongoose);

const app = express();

setupRouting(app); // Setup routing


// Connect to DB
mockgoose.prepareStorage()
  .then(() => {
    db.DBConnectMongoose()
      .then(() => {
        const port = config.get('port');
        app.listen(port || 3000); // Start the server
        console.log(`Server listening on port ${port}`);
      })
      .catch(err => console.log(`Error: ${err}`));
  });

module.exports = app;
