// import express from "express";
// import passport from "passport";
// import { register, login, googleAuthCallback, getMe } from "../controllers/authController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // Local auth
// router.post("/register", register);
// router.post("/login", login);

// // Google OAuth
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: `${process.env.FRONTEND_URL}/auth/error`,
//     session: false,
//   }),
//   googleAuthCallback
// );

// // Protected routes
// router.get("/me", protect, getMe);

// export default router;

import express from "express";
import passport from "passport";
import { register, login, googleAuthCallback, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Local auth
router.post("/register", register);
router.post("/login", login);

// Google OAuth
router.get("/google", (req, res, next) => {
  console.log("Initiating Google OAuth...");
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
});

router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("Google OAuth callback received");
    passport.authenticate("google", {
      failureRedirect: `${process.env.FRONTEND_URL}/auth/error`,
      session: false,
    })(req, res, next);
  },
  googleAuthCallback
);

// Test route to check if Google OAuth is configured
router.get("/google/test", (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Google OAuth credentials not configured",
    });
  }

  res.json({
    success: true,
    message: "Google OAuth is configured",
    clientId: process.env.GOOGLE_CLIENT_ID ? "Configured" : "Missing",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "Configured" : "Missing",
  });
});

// Protected routes
router.get("/me", protect, getMe);

export default router;
