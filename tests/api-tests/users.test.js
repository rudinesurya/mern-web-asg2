const supertest = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const { Mockgoose } = require('mockgoose');
const mockgoose = new Mockgoose(mongoose);
const db = require('../../setup/db');


describe('/api/users', function () {
  this.timeout(120000);

  const theUser = {
    name: 'testuser',
    email: 'test@test.com',
    password: 'secret',
    password2: 'secret',
  };

  const theUserLogin = {
    email: 'test@test.com',
    password: 'secret',
  };

  let theApp;

  // Start the server once before all tests
  before((done) => {
    mockgoose.prepareStorage().then(() => {
      db.DBConnectMongoose()
        .then(() => {
          theApp = require('../../server');
          done();
        }).catch(err => console.log(`Error: ${err}`));
    });
  });

  describe('Registeration', function () {
    // Clean up before each test
    beforeEach((done) => {
      mockgoose.helper.reset().then(done());
    });

    it('should register new user', async () => {
      const res = await supertest(theApp)
        .post('/api/users/')
        .send(theUser)
        .expect(201);

      const { name, email } = res.body;
      name.should.equal(theUser.name);
      email.should.equal(theUser.email);
    });

    it('should require all missing required variables', async () => {
      const { email, ...badUser } = theUser;

      await supertest(theApp)
        .post('/api/users/')
        .send(badUser)
        .expect(400);
    });

    it('should require email in right format', async () => {
      const badUser = { ...theUser, email: 'test' };

      await supertest(theApp)
        .post('/api/users/')
        .send(badUser)
        .expect(400);
    });
  });

  describe('Login', function () {
    // Create a user
    before(async () => {
      await supertest(theApp)
        .post('/api/users/')
        .send(theUser);
    });

    it('should login', async () => {
      const res = await supertest(theApp)
        .post('/api/users/login')
        .send(theUserLogin)
        .expect(200);
    });

    it('should not login with wrong password', async () => {
      const badUserLogin = { ...theUserLogin, password: 'wrong' };

      const res = await supertest(theApp)
        .post('/api/users/login')
        .send(badUserLogin)
        .expect(400);
    });
  });
});
