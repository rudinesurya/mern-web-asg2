const should = require('should');
const mongoose = require('mongoose');
const Profile = require('../../../models/UserProfile').Model;


describe('userProfileTests', () => {
  const id = mongoose.Types.ObjectId(); // generates pseudo random ObjectID
  const theProfile = {
    user: id,
    handle: id.toString(), // default handle is the user id
    location: 'a place',
    bio: 'something about me',
  };

  it('should validate the profile', (done) => {
    const m = new Profile(theProfile);
    m.validate((err) => {
      should.not.exist(err);
      m.user.should.equal(theProfile.user);
      m.handle.should.equal(theProfile.handle);
      m.location.should.equal(theProfile.location);
      m.bio.should.equal(theProfile.bio);
      done();
    });
  });

  it('should require all missing required variables', (done) => {
    const badProfile = {
      message: 'This is not valid',
    };
    const m = new Profile(badProfile);
    m.validate((err) => {
      should.exist(err);
      const { errors } = err;
      errors.should.have.property('user');
      errors.should.have.property('handle');
      done();
    });
  });
});
