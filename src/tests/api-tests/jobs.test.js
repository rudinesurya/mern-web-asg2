const supertest = require('supertest');
const mongoose = require('mongoose');
const mockgoose = require('../helper/mockgoose-helper');
const User = require('../../models/User').Model;
const Job = require('../../models/Job').Model;


describe('Jobs Test Suite', function () {
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

  describe('Registeration', () => {
    let user;
    let payload;
    let token;

    beforeEach(async () => {
      mockgoose.reset();
      payload = { ...theJobPayload };
      user = await new User(theUserPayload).save();
      token = await user.generateAuthToken();
    });

    const exec = () => supertest(server)
      .post('/api/jobs')
      .send(payload)
      .set('Authorization', `bearer ${token}`);


    it('should register', async () => {
      const res = await exec();
      res.status.should.equal(201);
    });

    it('should return 401. unauthenticated', async () => {
      token = '';
      const res = await exec();
      res.status.should.equal(401);
    });

    it('should return 400. bad input', async () => {
      payload = {};
      const res = await exec();
      res.status.should.equal(400);
    });
  });

  describe('Getting', () => {
    let user;
    let token;
    let job;
    let jobId;

    before(async () => {
      mockgoose.reset();
      user = await new User(theUserPayload).save();
      job = await new Job({ ...theJobPayload, host: user._id }).save();
      await new Job({ ...theJobPayload, title: 'xxx' }).save();
    });

    beforeEach(async () => {
      token = await user.generateAuthToken();
      jobId = job._id;
    });

    const getJobById = () => supertest(server)
      .get(`/api/jobs/${jobId}`)
      .set('Authorization', `bearer ${token}`);


    it('should return all jobs', async () => {
      const res = await supertest(server)
        .get('/api/jobs');

      res.status.should.equal(200);
      res.body.length.should.equal(2);
    });

    it('should return job by id', async () => {
      const res = await getJobById();
      res.status.should.equal(200);
    });

    it('should return 404. not found', async () => {
      jobId = new mongoose.Types.ObjectId();
      const res = await getJobById();
      res.status.should.equal(404);
    });

    it('should return 500. invalid id', async () => {
      jobId = 'invalid';
      const res = await getJobById();
      res.status.should.equal(500);
    });
  });

  describe('Updating', () => {
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
        title: 'new title',
        venue: 'new venue',
        date: 'new date',
      };
    });

    const exec = () => supertest(server)
      .patch(`/api/jobs/${jobId}`)
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

    it('should return 401. unauthenticated', async () => {
      token = '';
      const res = await exec();
      res.status.should.equal(401);
    });
  });

  describe('Deleting', () => {
    let user;
    let token;
    let job;
    let jobId;

    beforeEach(async () => {
      mockgoose.reset();
      user = await new User(theUserPayload).save();
      token = await user.generateAuthToken();
      job = await new Job({ ...theJobPayload, host: user._id }).save();
      jobId = job._id;
    });

    const exec = () => supertest(server)
      .delete(`/api/jobs/${jobId}`)
      .set('Authorization', `bearer ${token}`);


    it('should delete', async () => {
      const res = await exec();
      res.status.should.equal(200);
    });

    it('should return 401. unauthenticated', async () => {
      token = '';
      const res = await exec();
      res.status.should.equal(401);
    });

    it('should return 404. not found', async () => {
      jobId = new mongoose.Types.ObjectId();
      const res = await exec();
      res.status.should.equal(404);
    });

    it('should return 500. invalid id', async () => {
      jobId = 'invalid';
      const res = await exec();
      res.status.should.equal(500);
    });
  });
});
