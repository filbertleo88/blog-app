// api/index.js - For Vercel Serverless Functions
import app from "../server.js";
import connectDB from "../config/db.js";

// Connect to database on cold start
let isConnected = false;

export default async function handler(req, res) {
  // Connect to database on first request
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("✅ Database connected on serverless function");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      return res.status(500).json({
        error: "Database connection failed",
        details: error.message,
      });
    }
  }

  // Pass request to Express app
  return app(req, res);
}
