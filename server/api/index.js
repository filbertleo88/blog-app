// api/index.js
import app from "../server.js";
import connectDB from "../config/db.js";

// Global variable to track DB connection
let isConnected = false;

export default async function handler(req, res) {
  console.log(`${req.method} ${req.url}`);

  // Connect to database on first request (cold start)
  if (!isConnected) {
    try {
      console.log("🌐 Connecting to MongoDB...");
      await connectDB();
      isConnected = true;
      console.log("✅ MongoDB connected successfully");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error.message);
      return res.status(500).json({
        error: "Database connection failed",
        message: error.message,
      });
    }
  }

  // Pass the request to Express app
  return app(req, res);
}
