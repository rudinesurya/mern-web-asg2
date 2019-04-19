const supertest = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const mockgoose = require('../helper/mockgoose-helper');
const User = require('../../models/User').Model;
const Job = require('../../models/Job').Model;


describe('Jobs Test Suite', function () {
  let server;
  this.timeout(120000);

  before(async () => {
    server = await require('../helper/server').initialize();
  });

  after(async () => {
    await require('../helper/server').close();
  });

  describe('', () => {
    it('', async () => {

    });
  });


});
