const supertest = require('supertest');
const should = require('should');
const mockgoose = require('../helper/mockgoose-helper');


describe('Authentication Test Suite', function () {
  let server;
  this.timeout(120000);

  before(async () => {
    server = await require('../server').initialize();
  });

  after(async () => {
    await require('../server').close();
  });

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

  describe('Registeration', () => {
    // Clean up before each test
    beforeEach(async () => {
      await mockgoose.reset();
    });

    it('should register new user', async () => {
      const res = await supertest(server)
        .post('/api/users/')
        .send(theUser)
        .expect(201);

      const { name, email } = res.body;
      name.should.equal(theUser.name);
      email.should.equal(theUser.email);
    });

    it('should require all missing required variables', async () => {
      const { email, ...badUser } = theUser;

      await supertest(server)
        .post('/api/users/')
        .send(badUser)
        .expect(400);
    });

    it('should require email in right format', async () => {
      const badUser = { ...theUser, email: 'test' };

      await supertest(server)
        .post('/api/users/')
        .send(badUser)
        .expect(400);
    });
  });

  describe('Login', () => {
    // Create a user
    before(async () => {
      await supertest(server)
        .post('/api/users/')
        .send(theUser);
    });

    it('should login', async () => {
      const res = await supertest(server)
        .post('/api/users/login')
        .send(theUserLogin)
        .expect(200);
    });

    it('should return 401 when token is null', async () => {
      const token = '';
      await supertest(server)
        .get('/api/users/current')
        .set('Authorization', `bearer ${token}`)
        .expect(401);
    });

    it('should return 200 when token is valid', async () => {
      const res = await supertest(server)
        .post('/api/users/login')
        .send(theUserLogin)
        .expect(200);

      const token = res.body;

      await supertest(server)
        .get('/api/users/current')
        .set('Authorization', `bearer ${token}`)
        .expect(200);
    });

    it('should not login with wrong password', async () => {
      const badUserLogin = { ...theUserLogin, password: 'wrong' };

      const res = await supertest(server)
        .post('/api/users/login')
        .send(badUserLogin)
        .expect(400);
    });
  });
});
