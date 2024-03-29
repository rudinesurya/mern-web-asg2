const should = require('should');
const mongoose = require('mongoose');
const Job = require('../../../models/Job').Model;

describe('Job Model Unit Tests', () => {
  const id = mongoose.Types.ObjectId(); // generates pseudo random ObjectID
  const theJobPayload = {
    host: id,
    title: 'some job',
    payout: 400,
    venue: {
      name: 'place name',
      location: {
        type: 'Point',
        coordinates: [-100, 30],
      },
    },
    date: new Date(),
  };

  it('should validate', (done) => {
    const m = new Job(theJobPayload);
    m.validate((err) => {
      should.not.exist(err);
      m.host.should.equal(theJobPayload.host);
      m.title.should.equal(theJobPayload.title);
      m.venue.should.match(theJobPayload.venue);
      m.date.should.equal(theJobPayload.date);
      done();
    });
  });

  it('should require all missing required variables', (done) => {
    const badJobPayload = {
      message: 'This is not valid',
    };
    const m = new Job(badJobPayload);
    m.validate((err) => {
      should.exist(err);
      const { errors } = err;
      errors.should.have.property('host');
      errors.should.have.property('title');
      errors.should.have.property('venue');
      errors.should.have.property('date');
      done();
    });
  });

  it('should add a comment', (done) => {
    const m = new Job(theJobPayload);
    const id = mongoose.Types.ObjectId(); // generates pseudo random ObjectID
    m.comments.push({
      user: id,
      text: 'hi there!',
    });
    m.validate((err) => {
      should.not.exist(err);
      m.comments[0].user.should.equal(id);
      m.comments[0].text.should.equal('hi there!');
      done();
    });
  });

  it('should add 2 comments', (done) => {
    const m = new Job(theJobPayload);
    const id = mongoose.Types.ObjectId(); // generates pseudo random ObjectID
    m.comments.push({
      user: id,
      text: 'hi there!',
    });
    m.comments.push({
      user: id,
      text: 'hi there again!',
    });
    m.validate((err) => {
      should.not.exist(err);
      m.comments.length.should.equal(2);
      done();
    });
  });

  it('should require all missing required variables in a comment', (done) => {
    const m = new Job(theJobPayload);
    m.comments.push({
      message: 'This is not valid',
    });
    m.validate((err) => {
      should.exist(err);
      const { errors } = err;
      errors.should.have.property('comments.0.user');
      errors.should.have.property('comments.0.text');
      done();
    });
  });

  it('should add a participant', (done) => {
    const m = new Job(theJobPayload);
    const id = mongoose.Types.ObjectId(); // generates pseudo random ObjectID
    m.participants.push({
      user: id,
    });
    m.validate((err) => {
      should.not.exist(err);
      m.participants[0].user.should.equal(id);
      done();
    });
  });

  it('should add 2 participants', (done) => {
    const m = new Job(theJobPayload);
    const id = mongoose.Types.ObjectId(); // generates pseudo random ObjectID
    const id2 = mongoose.Types.ObjectId(); // generates pseudo random ObjectID
    m.participants.push({
      user: id,
    });
    m.participants.push({
      user: id2,
    });
    m.validate((err) => {
      should.not.exist(err);
      m.participants.length.should.equal(2);
      done();
    });
  });

  it('should require all missing required variables in a participant', (done) => {
    const m = new Job(theJobPayload);
    m.participants.push({
      message: 'This is not valid',
    });
    m.validate((err) => {
      should.exist(err);
      const { errors } = err;
      errors.should.have.property('participants.0.user');
      done();
    });
  });
});
