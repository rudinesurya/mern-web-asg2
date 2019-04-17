const should = require('should');
const User = require('../../../models/User');


describe('userTests', () => {
  const theUser = {
    name: 'test user',
    email: 'test@test.com',
    password: 'sosecret',
    avatarUrl: 'www.validurl.com/abc/def',
  };

  it('should validate the profile', (done) => {
    const m = new User(theUser);
    m.validate((err) => {
      should.not.exist(err);
      m.name.toString().should.equal(theUser.name);
      m.email.toString().should.equal(theUser.email);
      m.password.toString().should.equal(theUser.password);
      m.avatarUrl.toString().should.equal(theUser.avatarUrl);
      done();
    });
  });

  it('should require all missing required variables', (done) => {
    const badUser = {
      message: 'This is not valid',
    };
    const m = new User(badUser);
    m.validate((err) => {
      should.exist(err);
      const { errors } = err;
      errors.should.have.property('name');
      errors.should.have.property('email');
      errors.should.have.property('password');

      done();
    });
  });
});
