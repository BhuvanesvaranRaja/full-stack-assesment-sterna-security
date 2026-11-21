const mongoose = require('mongoose');
const config = require('./index');

/**
 * Connect to the configured MongoDB database and log connection or configuration problems.
 */
async function connectDB() {
  if (config.mongodbUri) {
    try {
      await mongoose.connect(config.mongodbUri, { serverSelectionTimeoutMS: 5000 });
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
    }
  } else {
    console.log('MongoDB not configured. Copy server/.env.example to server/.env.');
  }
}

module.exports = { connectDB };
