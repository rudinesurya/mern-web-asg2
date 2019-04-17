const supertest = require('supertest');
const should = require('should');


describe('User API test', function () {
  this.timeout(120000);

  const theUser = {
    name: 'testuser',
    email: 'test@test.com',
    password: 'secret',
  };

  // let server;
  //
  // before((done) => {
  //   server = supertest.agent('http://localhost:3000');
  //   server
  //     .post('/api/users/register')
  //     .send(theUser)
  //     .then(() => done());
  // });
  //
  // it('should pass login validation', (done) => {
  //   server
  //     .post('/api/users/login')
  //     .send(theUser)
  //     .expect('Content-type', /json/)
  //     .expect(200)
  //     .then((res) => {
  //       const { success } = res.body;
  //       success.should.equal(true);
  //       done();
  //     });
  // });

  // it('should require all missing required variables', (done) => {
  //   supertest(app)
  //     .post('/api/users/login')
  //     .send({ message: 'This is not valid' })
  //     .expect('Content-type', /json/)
  //     .expect(400)
  //     .then((res) => {
  //       const errors = res.body;
  //       errors.should.have.property('email');
  //       errors.should.have.property('password');
  //       done();
  //     });
  // });
  //
  // it('should require email in correct format', (done) => {
  //   supertest(app)
  //     .post('/api/users/login')
  //     .send({ ...theUser, email: 'different' })
  //     .expect('Content-type', /json/)
  //     .expect(400)
  //     .then((res) => {
  //       const errors = res.body;
  //       errors.should.have.property('email');
  //       done();
  //     });
  // });
});
