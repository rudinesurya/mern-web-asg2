const supertest = require('supertest');
const should = require('should');
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
    title: 'the title',
    payout: 500,
    venue: {
      name: 'place name',
      location: {
        type: 'Point',
        coordinates: [-100, 30],
      },
    },
    date: new Date(),
    description: 'sample job description',
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

    it('should return 422. bad input', async () => {
      payload = {};
      const res = await exec();
      res.status.should.equal(422);
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
      await new Job({ ...theJobPayload, title: 'xxx', host: user._id }).save();
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
      res.body.total.should.equal(2);
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
        venue: {
          name: 'new place name',
          location: {
            type: 'Point',
            coordinates: [-100, 30],
          },
        },
        date: new Date(),
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

    it('should return 422. bad input', async () => {
      payload = { junk: 'i am a junk' };
      const res = await exec();
      res.status.should.equal(422);
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

  describe('Pagination', () => {
    let user;
    let token;
    let page;
    let limit;

    before(async () => {
      mockgoose.reset();
      user = await new User(theUserPayload).save();
      token = await user.generateAuthToken();

      await new Job({
        ...theJobPayload,
        host: user._id,
        date: new Date(),
      }).save();
      await new Job({
        ...theJobPayload,
        host: user._id,
        date: new Date(),
      }).save();
      await new Job({
        ...theJobPayload,
        host: user._id,
        date: new Date(),
      }).save();
      await new Job({
        ...theJobPayload,
        host: user._id,
        date: new Date(),
      }).save();
      await new Job({
        ...theJobPayload,
        host: user._id,
        date: new Date(),
      }).save();
    });

    beforeEach(async () => {
      page = 1;
      limit = 100;
    });

    const exec = () => supertest(server)
      .get('/api/jobs')
      .query({
        page,
        limit,
      });

    it('should limit to 2 jobs only', async () => {
      limit = 2;
      const res = await exec();
      res.status.should.equal(200);

      const jobs = res.body.docs;
      jobs.length.should.be.equal(2);
    });

    it('should return the last job only', async () => {
      page = 3;
      limit = 2;
      const res = await exec();
      res.status.should.equal(200);

      const jobs = res.body.docs;
      jobs.length.should.be.equal(1);
    });
  });

  describe('Querying', () => {
    let user;
    let token;
    let query = {};
    let page;
    let limit;

    before(async () => {
      mockgoose.reset();
      user = await new User(theUserPayload).save();
      token = await user.generateAuthToken();

      await new Job({
        ...theJobPayload,
        host: user._id,
        payout: 1,
        date: new Date(),
      }).save();
      await new Job({
        ...theJobPayload,
        host: user._id,
        payout: 1,
        date: new Date(),
      }).save();
      await new Job({
        ...theJobPayload,
        host: user._id,
        payout: 2,
        date: new Date(),
      }).save();
      await new Job({
        ...theJobPayload,
        host: user._id,
        payout: 2,
        date: new Date(),
      }).save();
      await new Job({
        ...theJobPayload,
        host: user._id,
        payout: 2,
        date: new Date(),
      }).save();
    });

    beforeEach(async () => {
      query = JSON.stringify({
        host: user._id.toString(),
      });
      page = 1;
      limit = 100;
    });

    const exec = () => supertest(server)
      .get('/api/jobs')
      .query({
        query,
        page,
        limit,
      });

    it('should return 5 jobs', async () => {
      const res = await exec();
      res.status.should.equal(200);

      const jobs = res.body.docs;
      jobs.length.should.be.equal(5);
    });

    it('should return 0 jobs', async () => {
      query = JSON.stringify({
        host: new mongoose.Types.ObjectId().toString(),
      });
      const res = await exec();
      res.status.should.equal(200);

      const jobs = res.body.docs;
      jobs.length.should.be.equal(0);
    });

    it('should return 2 jobs with matching query', async () => {
      query = JSON.stringify({
        host: user._id.toString(),
        payout: 1,
      });
      const res = await exec();
      res.status.should.equal(200);

      const jobs = res.body.docs;
      jobs.length.should.be.equal(2);
    });

    it('should return 422, invalid json query', async () => {
      query = 'bad data';
      const res = await exec();
      res.status.should.equal(422);
    });

    it('should return 500, invalid mongoose id', async () => {
      query = JSON.stringify({
        host: 'dqwdqwdasdqwe12',
      });
      const res = await exec();
      res.status.should.equal(500);
    });
  });

  describe('Sorting', () => {
    let user;
    let token;
    let sortBy;
    let page;
    let limit;

    before(async () => {
      mockgoose.reset();
      user = await new User(theUserPayload).save();
      token = await user.generateAuthToken();

      await new Job({
        ...theJobPayload,
        host: user._id,
        date: new Date('2017-02-17T04:00:00'),
      }).save();
      await new Job({
        ...theJobPayload,
        host: user._id,
        date: new Date('2019-03-17T01:00:00'),
      }).save();
      await new Job({
        ...theJobPayload,
        host: user._id,
        date: new Date('2018-02-17T02:00:00'),
      }).save();
      await new Job({
        ...theJobPayload,
        host: user._id,
        date: new Date('2019-03-17T05:00:00'),
      }).save();
      await new Job({
        ...theJobPayload,
        host: user._id,
        date: new Date('2018-01-17T03:00:00'),
      }).save();
    });

    beforeEach(async () => {
      sortBy = JSON.stringify({
        date: -1,
      });
      page = 1;
      limit = 100;
    });

    const exec = () => supertest(server)
      .get('/api/jobs')
      .query({
        sortBy,
        page,
        limit,
      });


    it('should be in ascending date', async () => {
      sortBy = JSON.stringify({
        date: 1,
      });
      const res = await exec();
      res.status.should.equal(200);

      const jobs = res.body.docs;
      jobs.length.should.be.equal(5);

      let sorted = true;
      for (let i = 0; i < jobs.length - 1; ++i) {
        if (jobs[i].date > jobs[i + 1].date) {
          sorted = false;
          break;
        }
      }

      sorted.should.be.true();
    });

    it('should be in descending date', async () => {
      sortBy = JSON.stringify({
        date: -1,
      });
      const res = await exec();
      res.status.should.equal(200);

      const jobs = res.body.docs;
      jobs.length.should.be.equal(5);

      let sorted = true;
      for (let i = 0; i < jobs.length - 1; ++i) {
        if (jobs[i].date < jobs[i + 1].date) {
          sorted = false;
          break;
        }
      }

      sorted.should.be.true();
    });
  });
});
