const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(env.mongoUri, {
    autoIndex: true
  });

  return mongoose.connection;
};

module.exports = connectDB;

