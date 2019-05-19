const supertest = require('supertest');
const should = require('should');
const mockgoose = require('../helper/mockgoose-helper');
const User = require('../../models/User').Model;

describe('Admin Test Suite', function () {
  let server;
  this.timeout(120000);

  before(async () => {
    server = await require('../helper/server').initialize();
  });

  after(async () => {
    await require('../helper/server').close();
  });

  describe('Deleting', () => {
    let adminToken;
    let nonAdminToken;
    let token;
    let idToDelete;

    const userPayload = {
      name: 'testuser',
      email: 'test@test.com',
      password: 'secret',
    };

    const nonAdminPayload = {
      name: 'nonadmin',
      email: 'nonadmin@test.com',
      password: 'secret',
    };

    const adminPayload = {
      name: 'admin',
      email: 'admin@test.com',
      password: 'secret',
      isAdmin: true,
    };

    beforeEach(async () => {
      await mockgoose.reset();

      const user = await new User(userPayload).save();
      idToDelete = user._id;

      const admin = await new User(adminPayload).save();
      adminToken = await admin.generateAuthToken();

      const nonAdmin = await new User(nonAdminPayload).save();
      nonAdminToken = await nonAdmin.generateAuthToken();
    });

    const exec = () => supertest(server)
      .delete(`/api/users/${idToDelete}`)
      .set('Authorization', `bearer ${token}`);


    it('should delete', async () => {
      token = adminToken;
      const res = await exec();
      res.status.should.equal(200);
    });

    it('should return 403. not authorized', async () => {
      token = nonAdminToken;
      const res = await exec();
      res.status.should.equal(403);
    });
  });
});
