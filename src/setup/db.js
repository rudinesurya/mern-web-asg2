const mongoose = require('mongoose');
const config = require('config');

module.exports.DBConnectMongoose = function () {
  return new Promise((async (resolve, reject) => {
    mongoose.Promise = global.Promise;

    const mongoUri = config.get('mongo_uri');

    try {
      // database connect
      const conn = await mongoose.connect(mongoUri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      });
      console.log(`mongo connection created on ${mongoUri}`);
      resolve(conn);
    } catch (err) {
      console.log(`error creating db connection: ${err}`);
      reject(err);
    }
  }));
};
