const Pusher = require('pusher');
const config = require('config');

const appId = config.get('pusher_appId');
const key = config.get('pusher_key');
const secret = config.get('pusher_secret');
const cluster = config.get('pusher_cluster');

const pusher = new Pusher({
  appId,
  key,
  secret,
  cluster,
  encrypted: true,
});

module.exports = pusher;
