import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://reethikaraavi_db_user:<db_password>@cluster1.gliuuft.mongodb.net/?appName=Cluster1';
  
  // Mask URI for logging (hide password)
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
  console.log(`Attempting to connect to MongoDB: ${maskedUri}`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const err = error as Error;
    console.error(`MongoDB Connection Error: ${err.message}`);
    
    if (err.message.includes('ENOTFOUND')) {
      console.error('HINT: This is a DNS resolution error. Please check if your MONGODB_URI is correct and your cluster is active.');
      console.error('If you are using MongoDB Atlas, ensure you have whitelisted "0.0.0.0/0" in Network Access settings.');
    }
    
    process.exit(1);
  }
};

export default connectDB;
