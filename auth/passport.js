const passport = require('passport');
const passportJWT = require('passport-jwt');
const config = require('config');
const User = require('../models/User').Model;

const { ExtractJwt, Strategy } = passportJWT;
const secret = config.get('jwt_secret');
console.log(`jwt_secret is ${secret}`);


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;


const strategy = new Strategy(opts, (payload, done) => {
  User.findById(payload.id)
    .then((user) => {
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    })
    .catch(err => console.log(err));
});

passport.use(strategy);

module.exports = passport;
