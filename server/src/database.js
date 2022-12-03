const mongoose = require('mongoose');

exports.connect = () => {
  mongoose.connect(process.env.MONGO_DB_URL, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  return mongoose.connection;
};