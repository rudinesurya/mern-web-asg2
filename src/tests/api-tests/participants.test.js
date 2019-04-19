const supertest = require('supertest');
const mongoose = require('mongoose');
const mockgoose = require('../helper/mockgoose-helper');
const User = require('../../models/User').Model;
const Job = require('../../models/Job').Model;


describe('Participants Test Suite', function () {
  let server;
  this.timeout(120000);

  const theUserPayload = {
    name: 'testuser',
    email: 'test@test.com',
    password: 'secret',
    password2: 'secret',
  };

  const theJobPayload = {
    host: new mongoose.Types.ObjectId(),
    title: 'the title',
    venue: 'the venue',
    date: 'the date',
  };

  before(async () => {
    server = await require('../helper/server').initialize();
  });

  after(async () => {
    await require('../helper/server').close();
  });


  describe('Joining job', () => {
    let user;
    let user2;
    let token;
    let token2;
    let job;
    let jobId;

    beforeEach(async () => {
      mockgoose.reset();
      user = await new User(theUserPayload).save();
      user2 = await new User({ ...theUserPayload, email: 'diff@test.com' }).save();
      token = await user.generateAuthToken();
      token2 = await user2.generateAuthToken();
      job = await new Job({ ...theJobPayload, host: user._id }).save();
      jobId = job._id;
    });

    const exec = () => supertest(server)
      .post(`/api/jobs/join/${jobId}`)
      .set('Authorization', `bearer ${token}`);


    it('should return 400. host not allowed', async () => {
      const res = await exec();
      res.status.should.equal(400);
    });

    it('should join', async () => {
      token = token2;
      const res = await exec();
      res.status.should.equal(200);
    });

    it('should return 401. unauthenticated user', async () => {
      token = '';
      const res = await exec();
      res.status.should.equal(401);
    });
  });

  describe('Leaving job', () => {
    let user;
    let user2;
    let token;
    let token2;
    let job;
    let jobId;

    beforeEach(async () => {
      mockgoose.reset();
      user = await new User(theUserPayload).save();
      user2 = await new User({ ...theUserPayload, email: 'diff@test.com' }).save();
      token = await user.generateAuthToken();
      token2 = await user2.generateAuthToken();

      job = await new Job({
        ...theJobPayload,
        host: user._id,
        participants: [
          {
            user: user2._id,
            text: 'new comment',
          },
        ],
      }).save();

      jobId = job._id;
    });

    const exec = () => supertest(server)
      .post(`/api/jobs/leave/${jobId}`)
      .set('Authorization', `bearer ${token}`);


    it('should return 400. host not allowed', async () => {
      const res = await exec();
      res.status.should.equal(400);
    });

    it('should leave', async () => {
      token = token2;
      const res = await exec();
      res.status.should.equal(200);
    });

    it('should return 401. unauthenticated user', async () => {
      token = '';
      const res = await exec();
      res.status.should.equal(401);
    });
  });
});
