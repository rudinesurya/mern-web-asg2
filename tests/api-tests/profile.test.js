const supertest = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const mockgoose = require('../helper/mockgoose-helper');


describe('Profile Test Suite', function () {
  let server;
  this.timeout(120000);

  before(async () => {
    server = await require('../server').initialize();
    mockgoose.reset();
  });

  after(async () => {
    await require('../server').close();
  });

  describe('Check Auth', () => {
    it('should reject unauthorized user', async () => {
      await supertest(server)
        .get('/api/profiles/current')
        .expect(401);
    });
  });

  describe('GET api/profiles', () => {
    const profilePayload = {
      user: new mongoose.Types.ObjectId().toString(),
      handle: 'theHandle',
      location: 'theLocation',
      bio: 'theBio',
    };

    const profilePayload2 = {
      user: new mongoose.Types.ObjectId().toString(),
      handle: 'theHandle2',
      location: 'theLocation2',
      bio: 'theBio2',
    };

    before(async () => {
      // populate something
      await supertest(server)
        .post('/api/profiles')
        .send(profilePayload);

      await supertest(server)
        .post('/api/profiles')
        .send(profilePayload2);
    });

    it('should return all profiles', async () => {
      const res = await supertest(server)
        .get('/api/profiles')
        .expect(200);

      res.body.length.should.equal(2);
    });

    it('should return profile by handle', async () => {
      const res = await supertest(server)
        .get(`/api/profiles/${profilePayload.handle}`)
        .expect(200);
    });
  });
});
