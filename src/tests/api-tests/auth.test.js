const supertest = require('supertest');
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
    password2: 'secret',
  };

  describe('Registeration', () => {
    let payload;

    beforeEach(async () => {
      await mockgoose.reset();
      payload = { ...theUserPayload };
    });

    const exec = () => supertest(server)
      .post('/api/users/')
      .send(payload);


    it('should register new user', async () => {
      const res = await exec();

      res.status.should.equal(201);
      res.body.should.have.property('user');
      const { user } = res.body;
      user.name.should.equal(theUserPayload.name);
      user.email.should.equal(theUserPayload.email);
    });

    it('should return 400. missing required variables', async () => {
      payload.email = '';
      const res = await exec();
      res.status.should.equal(400);
    });

    it('should return 400. require email in right format', async () => {
      payload.email = 'testemail';
      const res = await exec();
      res.status.should.equal(400);
    });
  });

  describe('Login', () => {
    let payload;
    let theUser;

    before(async () => {
      await mockgoose.reset();
      theUser = await new User(theUserPayload).save();
    });

    beforeEach(async () => {
      payload = { email: theUserPayload.email, password: theUserPayload.password };
    });

    const exec = () => supertest(server)
      .post('/api/users/login')
      .send(payload);


    it('should login', async () => {
      const res = await exec();
      res.status.should.equal(200);
    });

    it('should return 400. wrong password', async () => {
      payload.password = 'wrongpw';
      const res = await exec();
      res.status.should.equal(400);
    });
  });

  describe('Token validation', () => {
    let token;
    let theUser;

    before(async () => {
      await mockgoose.reset();
      theUser = await new User(theUserPayload).save();
    });

    beforeEach(async () => {
      token = await theUser.generateAuthToken();
    });

    const exec = () => supertest(server)
      .get('/api/users/current')
      .set('Authorization', `bearer ${token}`);


    it('should return 401. token is invalid', async () => {
      token = '';
      const res = await exec();
      res.status.should.equal(401);
    });

    it('should validate token', async () => {
      const res = await exec();
      res.status.should.equal(200);
    });
  });

  describe('Deleting', () => {
    let user;
    let token;

    beforeEach(async () => {
      await mockgoose.reset();
      user = await new User(theUserPayload).save();
      token = await user.generateAuthToken();
    });

    const exec = () => supertest(server)
      .delete('/api/users/current')
      .set('Authorization', `bearer ${token}`);


    it('should delete', async () => {
      const res = await exec();
      res.status.should.equal(200);
    });

    it('should return 401. not logged in', async () => {
      token = '';
      const res = await exec();
      res.status.should.equal(401);
    });
  });
});
