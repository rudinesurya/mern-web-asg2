const users = require('./users');
const profiles = require('./profiles');
const jobs = require('./jobs');


exports.assignRoutes = function (app) {
  app.use('/api/users', users);
  app.use('/api/profiles', profiles);
  app.use('/api/jobs', jobs);
};
