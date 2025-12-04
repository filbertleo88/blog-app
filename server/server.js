import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import blogPostRoutes from "./routes/blogPostsRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import passport from "passport";
import { jwtStrategy } from "./config/passport.js";
import { googleStrategy } from "./config/googleOAuth.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

// Fix for ES modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Vercel needs async connection handling
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();

    // Session configuration (must come before passport)
    app.use(
      session({
        secret: process.env.SESSION_SECRET || "your-session-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
      })
    );

    // Passport configuration
    app.use(passport.initialize());
    app.use(passport.session()); // Add this for session support

    // Configure passport strategies
    passport.use(jwtStrategy);
    passport.use(googleStrategy);

    // Passport serialization/deserialization
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    // In server.js - update the deserializeUser function
    passport.deserializeUser(async (id, done) => {
      try {
        const User = (await import("./models/User.js")).default;
        const user = await User.findById(id);
        done(null, user);
      } catch (error) {
        console.error("Deserialization error:", error);
        done(error, null);
      }
    });

    // Middleware
    app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // ⚠️ FIX: INCREASE PAYLOAD SIZE LIMIT - Add this BEFORE your routes
    app.use(express.json({ limit: "50mb" })); // Increase to 50MB
    app.use(express.urlencoded({ limit: "50mb", extended: true }));
    app.use(cookieParser());

    // Serve static files from uploads directory
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    // Routes
    app.use("/api/users", userRoutes);
    app.use("/api/blogposts", blogPostRoutes);
    app.use("/api/comments", commentRoutes);
    app.use("/api/upload", uploadRoutes);
    app.use("/api/auth", authRoutes);

    // Health check route
    app.get("/api/health", (req, res) => {
      res.json({
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString(),
      });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error("Error:", err.stack);
      res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: process.env.NODE_ENV === "production" ? {} : err.message,
      });
    });

    // 404 handler
    app.use("*", (req, res) => {
      res.status(404).json({
        success: false,
        message: "Route not found",
      });
    });

    const PORT = process.env.PORT || 5009;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// For Vercel, export the app
export default app;

// Start server if not in Vercel environment
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  startServer();
}
