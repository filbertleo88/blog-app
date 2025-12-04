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

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Configure passport strategies
passport.use(jwtStrategy);
passport.use(googleStrategy);

// Passport serialization/deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

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
    origin: ['https://inskpire-blog-app-git-update-blog-schema-filbertleo88s-projects.vercel.app',process.env.FRONTEND_URL , process.env.BACKEND_URL , "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ ADD A ROOT ROUTE
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Blog App API",
    endpoints: {
      users: "/api/users",
      blogPosts: "/api/blogposts",
      comments: "/api/comments",
      upload: "/api/upload",
      auth: "/api/auth",
      health: "/api/health",
    },
    documentation: "Add your docs link here",
  });
});

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
    environment: process.env.NODE_ENV || "development",
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

// 404 handler - should be last
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    requestedUrl: req.originalUrl,
  });
});

// ✅ Export the app for Vercel (NO app.listen here!)
export default app;

// ✅ Only start server if running locally
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5009;

  // Connect to DB and start server
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      });
    } catch (error) {
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  };

  startServer();
}
