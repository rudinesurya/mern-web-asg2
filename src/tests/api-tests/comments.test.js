const supertest = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const mockgoose = require('../helper/mockgoose-helper');
const User = require('../../models/User').Model;
const Job = require('../../models/Job').Model;

describe('Comments Test Suite', function () {
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
    venue: {
      name: 'place name',
      location: {
        type: 'Point',
        coordinates: [-100, 30],
      },
    },
    date: new Date(),
  };

  before(async () => {
    server = await require('../helper/server').initialize();
  });

  after(async () => {
    await require('../helper/server').close();
  });


  describe('Posting comment', () => {
    let user;
    let token;
    let job;
    let jobId;
    let payload;

    beforeEach(async () => {
      mockgoose.reset();
      user = await new User(theUserPayload).save();
      token = await user.generateAuthToken();
      job = await new Job({ ...theJobPayload, host: user._id }).save();
      jobId = job._id;
      payload = {
        user: user._id,
        text: 'new comment',
      };
    });

    const exec = () => supertest(server)
      .post(`/api/jobs/comment/${jobId}`)
      .send(payload)
      .set('Authorization', `bearer ${token}`);


    it('should post', async () => {
      const res = await exec();
      res.status.should.equal(200);
    });

    it('should return 422. bad input', async () => {
      payload = { junk: 'i am a junk' };
      const res = await exec();
      res.status.should.equal(422);
    });

    it('should return 401. unauthorized user', async () => {
      token = '';
      const res = await exec();
      res.status.should.equal(401);
    });
  });

  describe('Removing comment', () => {
    let user;
    let token;
    let job;
    let jobId;
    let commentId;

    beforeEach(async () => {
      mockgoose.reset();
      user = await new User(theUserPayload).save();
      token = await user.generateAuthToken();
      commentId = new mongoose.Types.ObjectId();

      job = await new Job({
        ...theJobPayload,
        host: user._id,
        comments: [
          {
            _id: commentId,
            user: user._id,
            text: 'new comment',
          },
        ],
      }).save();

      jobId = job._id;
    });

    const exec = () => supertest(server)
      .delete(`/api/jobs/comment/${jobId}/${commentId}`)
      .set('Authorization', `bearer ${token}`);


    it('should remove', async () => {
      const res = await exec();
      res.status.should.equal(200);
    });

    it('should return 404. comment not found', async () => {
      commentId = new mongoose.Types.ObjectId();
      const res = await exec();
      res.status.should.equal(404);
    });

    it('should return 401. unauthorized user', async () => {
      token = '';
      const res = await exec();
      res.status.should.equal(401);
    });
  });
});
