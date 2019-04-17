// const supertest = require('supertest');
// const should = require('should');
// const app = require('../../app');
//
//
// describe('User API test', function () {
//   this.timeout(120000);
//
//   const theUser = {
//     name: 'testuser',
//     email: 'test@test.com',
//     password: 'secret',
//     password2: 'secret',
//   };
//
//   it('should pass register', (done) => {
//     supertest(app)
//       .post('/api/users/register')
//       .send(theUser)
//       .expect('Content-type', /json/)
//       .expect(200)
//       .then((res) => {
//         const { name, email } = res.body;
//         name.should.equal(theUser.name);
//         email.should.equal(theUser.email);
//         done();
//       });
//   });
//
//   it('should not allow duplicate email', (done) => {
//     supertest(app)
//       .post('/api/users/register')
//       .send(theUser)
//       .then((res) => {
//         supertest(app)
//           .post('/api/users/register')
//           .send(theUser)
//           .expect('Content-type', /json/)
//           .expect(400)
//           .then((res) => {
//             done();
//           });
//       });
//   });
//
//   it('should require all missing required variables', (done) => {
//     supertest(app)
//       .post('/api/users/register')
//       .send({ message: 'This is not valid' })
//       .expect('Content-type', /json/)
//       .expect(400)
//       .then((res) => {
//         const errors = res.body;
//         errors.should.have.property('name');
//         errors.should.have.property('email');
//         errors.should.have.property('password');
//         errors.should.have.property('password2');
//         done();
//       });
//   });
//
//   it('should require both passwords to be the same', (done) => {
//     supertest(app)
//       .post('/api/users/register')
//       .send({ ...theUser, password2: 'different' })
//       .expect('Content-type', /json/)
//       .expect(400)
//       .then((res) => {
//         const errors = res.body;
//         errors.should.have.property('password');
//         done();
//       });
//   });
//
//   it('should require email in correct format', (done) => {
//     supertest(app)
//       .post('/api/users/register')
//       .send({ ...theUser, email: 'different' })
//       .expect('Content-type', /json/)
//       .expect(400)
//       .then((res) => {
//         const errors = res.body;
//         errors.should.have.property('email');
//         done();
//       });
//   });
// });
