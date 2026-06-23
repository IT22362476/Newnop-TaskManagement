/**
 * Database connection configuration
 * Connects to MongoDB using Mongoose
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Don't crash — allow the server to run so health checks can report the error
    return null;
  }
};

module.exports = connectDB;
