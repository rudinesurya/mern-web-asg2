const db = require('./setup/db');


db.DBConnectMongoose()
  .then(() => {
    require('./server');
  }).catch(err => console.log(`Error: ${err}`));
