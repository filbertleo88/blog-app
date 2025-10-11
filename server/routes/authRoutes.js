
// routes/authRoutes.js
import express from "express";
import passport from "passport";
import { register, login, googleAuthCallback, getCurrentUser, updateProfile, testConfig, debugGoogle } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Local authentication
router.post("/register", register);
router.post("/login", login);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/?auth=error`,
    session: false,
  }),
  googleAuthCallback
);

// Protected routes
router.get("/me", protect, getCurrentUser);
router.put("/profile", protect, updateProfile);

// Test routes
router.get("/test-config", testConfig);
router.get("/debug/google", debugGoogle);

export default router;
