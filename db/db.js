const mongoose = require('mongoose');
const config = require('config');

const mongoUri = config.get('mongo_uri');
console.log(`mongoUri is ${mongoUri}`);

exports.DBConnectMongoose = function () {
  return new Promise(((resolve, reject) => {
    mongoose.Promise = global.Promise;

    // database connect
    mongoose.connect(mongoUri, {
      useCreateIndex: true,
      useNewUrlParser: true,
    })
      .then(() => {
        console.log('mongo connection created');
        resolve(mongoose.connection);
      })
      .catch((err) => {
        console.log(`error creating db connection: ${err}`);
        reject(err);
      });
  }));
};
