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
    password2: 'secret',
  };

  const theProfilePayload = {
    user: new mongoose.Types.ObjectId(),
    handle: 'theHandle',
    location: 'theLocation',
    bio: 'theBio',
  };

  before(async () => {
    server = await require('../helper/server').initialize();
  });

  after(async () => {
    await require('../helper/server').close();
  });

  describe('Registeration', () => {
    let payload;

    beforeEach(async () => {
      mockgoose.reset();
      payload = { ...theProfilePayload };
    });

    const exec = () => supertest(server)
      .post('/api/profiles')
      .send(payload);


    it('should register', async () => {
      const res = await exec();
      res.status.should.equal(201);
    });

    it('should return 400. bad input', async () => {
      payload.handle = '';
      const res = await exec();
      res.status.should.equal(400);
    });

    it('should return 400. bad input', async () => {
      payload.junk = 'i am a junk';
      const res = await exec();
      res.status.should.equal(400);
    });
  });

  describe('Getting', () => {
    let user;
    let handle;
    let token;

    before(async () => {
      mockgoose.reset();
      user = await new User(theUserPayload).save();

      await new Profile({
        ...theProfilePayload,
        user: user._id,
      }).save();

      const newProfilePayload = {
        user: new mongoose.Types.ObjectId(),
        handle: 'theHandle2',
        location: 'theLocation2',
        bio: 'theBio2',
      };

      await new Profile(newProfilePayload).save();
    });

    beforeEach(async () => {
      handle = theProfilePayload.handle;
      token = await user.generateAuthToken();
    });

    const getProfileByHandle = () => supertest(server)
      .get(`/api/profiles/${handle}`);

    const getCurrentProfile = () => supertest(server)
      .get('/api/profiles/current')
      .set('Authorization', `bearer ${token}`);


    it('should return all profiles', async () => {
      const res = await supertest(server)
        .get('/api/profiles');

      res.status.should.equal(200);
      res.body.length.should.equal(2);
    });

    it('should return profile by handle', async () => {
      const res = await getProfileByHandle();
      res.status.should.equal(200);
    });

    it('should return 404. invalid handle', async () => {
      handle = 'invalid';
      const res = await getProfileByHandle();
      res.status.should.equal(404);
    });

    it('should return 401. unauthorized user', async () => {
      token = '';
      const res = await getCurrentProfile();
      res.status.should.equal(401);
    });

    it('should return current user profile', async () => {
      const res = await getCurrentProfile();
      res.status.should.equal(200);
    });

    it('should return 404. not found', async () => {
      const newUser = await new User(theUserPayload).save();
      token = await newUser.generateAuthToken(); // this user does not have a profile yet
      const res = await getCurrentProfile();
      res.status.should.equal(404);
    });
  });

  describe('Updating', () => {
    let user;
    let token;
    let payload;

    before(async () => {
      mockgoose.reset();
      user = await new User(theUserPayload).save();
    });

    beforeEach(async () => {
      payload = {
        handle: 'new handle',
        location: 'new location',
        bio: 'new bio',
      };
      token = await user.generateAuthToken();
    });

    const exec = () => supertest(server)
      .post('/api/profiles/current')
      .send(payload)
      .set('Authorization', `bearer ${token}`);


    it('should update', async () => {
      const res = await exec();
      res.status.should.equal(200);
    });

    it('should return 400. bad input', async () => {
      payload = { junk: 'i am a junk' };
      const res = await exec();
      res.status.should.equal(400);
    });
  });
});
