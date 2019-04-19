const supertest = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const mockgoose = require('../helper/mockgoose-helper');
const User = require('../../models/User').Model;
const Profile = require('../../models/Profile').Model;


describe('Profiles Test Suite', function () {
  let server;
  this.timeout(120000);

  const theUserPayload = {
    name: 'testuser',
    email: 'test@test.com',
    password: 'secret',
  };

  const theProfilePayload = {
    user: new mongoose.Types.ObjectId(),
    handle: 'theHandle',
    location: 'theLocation',
    bio: 'theBio',
  };

  const theProfilePayload2 = {
    user: new mongoose.Types.ObjectId(),
    handle: 'theHandle2',
    location: 'theLocation2',
    bio: 'theBio2',
  };

  before(async () => {
    server = await require('../helper/server').initialize();
  });

  after(async () => {
    await require('../helper/server').close();
  });

  describe('Registeration', () => {
    beforeEach(async () => {
      mockgoose.reset();
    });

    it('should register', async () => {
      const res = await supertest(server)
        .post('/api/profiles')
        .send(theProfilePayload);

      res.status.should.equal(201);
    });

    it('should return 400. bad input', async () => {
      const { handle, badProfilePayload } = theProfilePayload;

      const res = await supertest(server)
        .post('/api/profiles')
        .send(badProfilePayload);

      res.status.should.equal(400);
    });
  });

  describe('Getting', () => {
    before(async () => {
      mockgoose.reset();

      // populate something
      await new Profile(theProfilePayload).save();
      await new Profile(theProfilePayload2).save();
    });

    it('should return all profiles', async () => {
      const res = await supertest(server)
        .get('/api/profiles');

      res.status.should.equal(200);
      res.body.length.should.equal(2);
    });

    it('should return profile by handle', async () => {
      const res = await supertest(server)
        .get(`/api/profiles/${theProfilePayload.handle}`);

      res.status.should.equal(200);
    });

    it('should return 404. invalid handle', async () => {
      const res = await supertest(server)
        .get('/api/profiles/invalid');

      res.status.should.equal(404);
    });

    it('should return 401. unauthorized user', async () => {
      const res = await supertest(server)
        .get('/api/profiles/current');

      res.status.should.equal(401);
    });

    it('should return current user profile', async () => {
      const user = await new User(theUserPayload).save();

      await new Profile({
        ...theProfilePayload,
        user: user._id,
      }).save();

      const token = await user.generateAuthToken();

      const res = await supertest(server)
        .get('/api/profiles/current')
        .set('Authorization', `bearer ${token}`);

      res.status.should.equal(200);
    });

    it('should return 404. not found', async () => {
      const user = await new User(theUserPayload).save();
      const token = await user.generateAuthToken();

      const res = await supertest(server)
        .get('/api/profiles/current')
        .set('Authorization', `bearer ${token}`);

      res.status.should.equal(404);
    });
  });

  describe('Updating', () => {
    let user;
    let token;
    before(async () => {
      mockgoose.reset();
      user = await new User(theUserPayload).save();
      token = await user.generateAuthToken();
    });

    it('should update', async () => {
      const res = await supertest(server)
        .post('/api/profiles/current')
        .send({ bio: 'new bio' })
        .set('Authorization', `bearer ${token}`);


      res.status.should.equal(200);
    });

    it('should return 400. bad input', async () => {
      const res = await supertest(server)
        .post('/api/profiles/current')
        .send({ unknown: 'abc' })
        .set('Authorization', `bearer ${token}`);


      res.status.should.equal(400);
    });
  });
});
