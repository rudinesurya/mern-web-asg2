const should = require('should');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const User = require('../../../models/User').Model;

describe('User Model Unit Tests', () => {
  const theUserPayload = {
    name: 'test user',
    email: 'test@test.com',
    password: 'sosecret',
    avatarUrl: 'www.validurl.com/abc/def',
  };

  it('should validate', (done) => {
    const m = new User(theUserPayload);
    m.validate((err) => {
      should.not.exist(err);
      m.name.should.equal(theUserPayload.name);
      m.email.should.equal(theUserPayload.email);
      m.password.should.equal(theUserPayload.password);
      m.avatarUrl.should.equal(theUserPayload.avatarUrl);
      done();
    });
  });

  it('should require all missing required variables', (done) => {
    const badUserPayload = {
      message: 'This is not valid',
    };
    const m = new User(badUserPayload);
    m.validate((err) => {
      should.exist(err);
      const { errors } = err;
      errors.should.have.property('name');
      errors.should.have.property('email');
      errors.should.have.property('password');

      done();
    });
  });

  it('should generate correct auth token', (done) => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: 'test user',
      email: 'test@test.com',
    };

    const m = new User(payload);
    m.generateAuthToken()
      .then((token) => {
        const decoded = jwt.verify(token, config.get('jwt_secret'));
        decoded.should.match(payload);

        done();
      });
  });
});
