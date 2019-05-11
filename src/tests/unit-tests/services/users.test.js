const should = require('should');
const sinon = require('sinon');
const mongoose = require('mongoose');
const User = require('../../../models/User').Model;
const users = require('../../../services/users');

describe('Users Service Unit Tests', () => {
  const theUser = {
    _id: new mongoose.Types.ObjectId(),
    name: 'test user',
    email: 'test@test.com',
    password: 'sosecret',
    avatarUrl: 'www.validurl.com/abc/def',
  };

  let sandbox;
  let findOneStubbed;
  let findOneAndRemoveStubbed;

  before(() => {
    sandbox = sinon.createSandbox();
    findOneStubbed = sandbox.stub(mongoose.Model, 'findOne');
    findOneAndRemoveStubbed = sandbox.stub(mongoose.Model, 'findOneAndRemove');

    findOneStubbed.callsFake(({ email }) => {
      if (!email.length) return null;
      return theUser;
    });

    findOneAndRemoveStubbed.callsFake(({ _id }) => {
      if (!_id.length) return null;
      return { result: true };
    });
  });

  after(() => {
    sandbox.restore();
  });

  it('should return user by email', async () => {
    const { doc } = await users.getDocByEmail('test@test.com');
    doc.should.match(theUser);
  });

  it('should return null. not found', async () => {
    const { doc } = await users.getDocByEmail('');
    should.not.exist(doc);
  });

  it('should delete', async () => {
    const { doc } = await users.deleteById('123456');
    findOneAndRemoveStubbed.called.should.be.true();
  });
});
