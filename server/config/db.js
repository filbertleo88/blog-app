import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");

    // Log connection string (masked)
    const maskedURI = process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)/, "mongodb+srv://$1:****") : "MONGODB_URI is undefined";
    console.log("Connection string:", maskedURI);

    // Connect to MongoDB
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    // ✅ FIXED: Use connection.connection instead of undefined 'conn'
    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
    console.log(`📊 Database: ${connection.connection.name}`);

    return connection;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error("Error details:", error);
    process.exit(1);
  }
};

export default connectDB;
