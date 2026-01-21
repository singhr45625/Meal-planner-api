// config/database.js - MODIFIED VERSION
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // ADD THIS CHECK
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is undefined. Check environment variables.');
      console.log('Available env vars:', Object.keys(process.env));
      process.exit(1);
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;