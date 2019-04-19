const supertest = require('supertest');
const should = require('should');
const mockgoose = require('../helper/mockgoose-helper');
const User = require('../../models/User').Model;


describe('Authentication Test Suite', function () {
  let server;
  this.timeout(120000);

  before(async () => {
    server = await require('../helper/server').initialize();
  });

  after(async () => {
    await require('../helper/server').close();
  });

  const theUserPayload = {
    name: 'testuser',
    email: 'test@test.com',
    password: 'secret',
  };

  const theUserLoginPayload = {
    email: 'test@test.com',
    password: 'secret',
  };

  describe('Registeration', () => {
    // Clean up before each test
    beforeEach(async () => {
      await mockgoose.reset();
    });

    it('should register new user', async () => {
      const res = await supertest(server)
        .post('/api/users/')
        .send({ ...theUserPayload, password2: theUserPayload.password });

      res.status.should.equal(201);

      res.body.should.have.property('user');
      const { user } = res.body;
      user.name.should.equal(theUserPayload.name);
      user.email.should.equal(theUserPayload.email);
    });

    it('should return 400. missing required variables', async () => {
      const { email, ...badUserPayload } = theUserPayload;

      const res = await supertest(server)
        .post('/api/users/')
        .send(badUserPayload);

      res.status.should.equal(400);
    });

    it('should return 400. require email in right format', async () => {
      const badUser = { ...theUserPayload, email: 'test' };

      const res = await supertest(server)
        .post('/api/users/')
        .send(badUser);

      res.status.should.equal(400);
    });
  });

  describe('Login', () => {
    // Create a user
    let theUser;
    before(async () => {
      await mockgoose.reset();
      theUser = await new User(theUserPayload).save();
    });

    it('should login', async () => {
      const res = await supertest(server)
        .post('/api/users/login')
        .send(theUserLoginPayload);

      res.status.should.equal(200);
    });

    it('should return 401. token is invalid', async () => {
      const token = '';
      const res = await supertest(server)
        .get('/api/users/current')
        .set('Authorization', `bearer ${token}`);

      res.status.should.equal(401);
    });

    it('should validate token', async () => {
      const token = await theUser.generateAuthToken();

      const res = await supertest(server)
        .get('/api/users/current')
        .set('Authorization', `bearer ${token}`);

      res.status.should.equal(200);
    });

    it('should return 400. wrong password', async () => {
      const badUserLogin = { ...theUserLoginPayload, password: 'wrong' };

      const res = await supertest(server)
        .post('/api/users/login')
        .send(badUserLogin);

      res.status.should.equal(400);
    });
  });

  describe('Delete Account', () => {
    // Clean up before each test
    beforeEach(async () => {
      await mockgoose.reset();
    });

    it('should delete', async () => {
      // Create then delete myself
      const user = await new User(theUserPayload).save();
      const token = await user.generateAuthToken();

      const res = await supertest(server)
        .delete('/api/users/current')
        .set('Authorization', `bearer ${token}`);

      res.status.should.equal(200);
    });

    it('should return 401. not logged in', async () => {
      // Create then delete myself
      const user = await new User(theUserPayload).save();
      const token = '';

      const res = await supertest(server)
        .delete('/api/users/current')
        .set('Authorization', `bearer ${token}`);

      res.status.should.equal(401);
    });
  });
});
