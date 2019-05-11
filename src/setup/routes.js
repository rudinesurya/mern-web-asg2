const express = require('express');
require('express-async-errors');
const passport = require('./passport'); // import passport configured with JWT strategy
const users = require('../routes/api/users');
const profiles = require('../routes/api/profiles');
const jobs = require('../routes/api/jobs');
const error = require('../middlewares/error');

module.exports = function (app) {
  // Assign middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(passport.initialize());

  app.use('/api/users', users);
  app.use('/api/profiles', profiles);
  app.use('/api/jobs', jobs);

  app.use(error);
};
