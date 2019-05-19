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
    handle: 'theHandle',
    location: {
      name: 'place name',
      location: {
        type: 'Point',
        coordinates: [-100, 30],
      },
    },
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
    let user;
    let token;

    beforeEach(async () => {
      mockgoose.reset();
      user = await new User(theUserPayload).save();
      token = await user.generateAuthToken();
      payload = { ...theProfilePayload };
    });

    const exec = () => supertest(server)
      .post('/api/profiles')
      .send(payload)
      .set('Authorization', `bearer ${token}`);


    it('should register', async () => {
      const res = await exec();
      res.status.should.equal(201);
    });

    it('should return 422. bad input', async () => {
      payload.handle = '';
      const res = await exec();
      res.status.should.equal(422);
    });

    it('should return 422. bad input', async () => {
      payload.junk = 'i am a junk';
      const res = await exec();
      res.status.should.equal(422);
    });
  });

  describe('Getting', () => {
    let user;
    let userId;
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
        ...theProfilePayload,
        handle: 'theHandle2',
      };

      await new Profile({ ...newProfilePayload, user: new mongoose.Types.ObjectId() }).save();
    });

    beforeEach(async () => {
      userId = user._id;
      handle = theProfilePayload.handle;
      token = await user.generateAuthToken();
    });

    const getProfileByUserId = () => supertest(server)
      .get(`/api/profiles/${userId}`);

    const getProfileByHandle = () => supertest(server)
      .get(`/api/profiles/handle/${handle}`);

    const getCurrentProfile = () => supertest(server)
      .get('/api/profiles/current')
      .set('Authorization', `bearer ${token}`);


    it('should return all profiles', async () => {
      const res = await supertest(server)
        .get('/api/profiles');

      res.status.should.equal(200);
      res.body.length.should.equal(2);
    });

    it('should return profile by userId', async () => {
      const res = await getProfileByUserId();
      res.status.should.equal(200);
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

    it('should return 401. unauthenticated', async () => {
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
        location: {
          name: 'new place name',
          location: {
            type: 'Point',
            coordinates: [-120, 30],
          },
        },
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

    it('should return 422. bad input', async () => {
      payload = { junk: 'i am a junk' };
      const res = await exec();
      res.status.should.equal(422);
    });
  });
});
