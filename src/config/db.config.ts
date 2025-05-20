import mongoose from "mongoose";
import { MONGODB_URI } from "./env.config";

export async function dbConnection() {
  try {
    const options = {
      serverSelectionTimeoutMS: 30000, // Increased timeout for Atlas
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000, // Increased timeout for Atlas
      maxPoolSize: 50,
      minPoolSize: 10,
      retryWrites: true,
      writeConcern: {
        w: 1
      }
    };

    await mongoose.connect(MONGODB_URI, options);
    console.log("✅ Database connected successfully to MongoDB Atlas");
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      // Attempt to reconnect
      setTimeout(() => {
        console.log('Attempting to reconnect to MongoDB...');
        mongoose.connect(MONGODB_URI, options);
      }, 5000);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error("❌ Database connection failed:", error);
    // Don't exit immediately, try to reconnect
    console.log('Attempting to reconnect in 5 seconds...');
    setTimeout(() => {
      dbConnection();
    }, 5000);
  }
}
