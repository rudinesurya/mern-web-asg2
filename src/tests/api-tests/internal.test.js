const supertest = require('supertest');


describe('Internal Server Test Suite', function () {
  let server;
  this.timeout(120000);

  before(async () => {
    server = await require('../helper/server').initialize();
  });

  after(async () => {
    await require('../helper/server').close();
  });

  const exec = () => supertest(server)
    .get('/api/abcd');


  it('should return 500. invalid url', async () => {
    const res = await exec();
    res.status.should.equal(500);
  });
});
