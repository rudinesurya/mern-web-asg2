const should = require('should');
const mongoose = require('mongoose');
const Profile = require('../../../models/Profile').Model;


describe('Profile Model Unit Tests', () => {
  const id = mongoose.Types.ObjectId(); // generates pseudo random ObjectID
  const theProfilePayload = {
    user: id,
    handle: id.toString(), // default handle is the user id
    location: {
      name: 'place name',
      location: {
        type: 'Point',
        coordinates: [-100, 30],
      },
    },
    bio: 'something about me',
  };

  it('should validate', (done) => {
    const m = new Profile(theProfilePayload);
    m.validate((err) => {
      should.not.exist(err);
      m.user.should.equal(theProfilePayload.user);
      m.handle.should.equal(theProfilePayload.handle);
      m.location.should.match(theProfilePayload.location);
      m.bio.should.equal(theProfilePayload.bio);
      done();
    });
  });

  it('should require all missing required variables', (done) => {
    const badProfilePayload = {
      message: 'This is not valid',
    };
    const m = new Profile(badProfilePayload);
    m.validate((err) => {
      should.exist(err);
      const { errors } = err;
      errors.should.have.property('user');
      errors.should.have.property('handle');
      done();
    });
  });
});
