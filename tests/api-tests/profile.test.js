// const supertest = require('supertest');
// const should = require('should');
//
// let server;
//
//
// describe('/api/profiles', function () {
//   this.timeout(120000);
//
//   beforeEach(() => {
//     server = require('../../server');
//   });
//
//   afterEach(async () => {
//     await server.close();
//   });
//
//   describe('GET /', () => {
//     beforeEach(() => {
//
//     });
//
//     afterEach(async () => {
//
//     });
//
//     it('should return all profiles', async () => {
//       const res = await supertest(server).get('/api/profiles');
//       res.status.should.equal(200);
//       res.body.length.should.equal(2);
//     });
//
//   });
//
//
// });
