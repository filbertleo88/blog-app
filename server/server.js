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

// Passport configuration
passport.use(jwtStrategy);
passport.use(googleStrategy);

import path from "path"; // Add this import
import { fileURLToPath } from "url"; // Add this import for ES modules

// Fix for ES modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/blogposts", blogPostRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5009;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
