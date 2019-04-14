const passport = require('passport');
const passportJWT = require('passport-jwt');
const User = require('../model/User');

const { ExtractJwt, JwtStrategy } = passportJWT;
const { SECRET } = process.env;


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET;


const strategy = new JwtStrategy(opts, (payload, done) => {
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
