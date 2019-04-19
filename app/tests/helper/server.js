const express = require('express');
const config = require('config');
require('../../setup/extras');
const mongoose = require('mongoose');
const { Mockgoose } = require('mockgoose');
const setupRouting = require('../../setup/routes');
const db = require('../../setup/db');

const mockgoose = new Mockgoose(mongoose);

const app = express();
let server;

setupRouting(app); // Setup routing


module.exports.initialize = () => {
  return new Promise(async (resolve, reject) => {
    // Connect to DB
    mockgoose.prepareStorage()
      .then(() => {
        db.DBConnectMongoose()
          .then(() => {
            const port = process.env.PORT || config.get('port') || 3000;
            server = app.listen(port); // Start the server
            console.log(`Server listening on port ${port}`);
            resolve(server);
          })
          .catch(err => reject(err));
      });
  });
};

module.exports.close = () => {
  server.close();
};
