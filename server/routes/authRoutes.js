// // import express from "express";
// // import passport from "passport";
// // import { register, login, googleAuthCallback, getMe } from "../controllers/authController.js";
// // import { protect } from "../middleware/authMiddleware.js";

// // const router = express.Router();

// // // Local auth
// // router.post("/register", register);
// // router.post("/login", login);

// // // Google OAuth
// // router.get(
// //   "/google",
// //   passport.authenticate("google", {
// //     scope: ["profile", "email"],
// //   })
// // );

// // router.get(
// //   "/google/callback",
// //   passport.authenticate("google", {
// //     failureRedirect: `${process.env.FRONTEND_URL}/auth/error`,
// //     session: false,
// //   }),
// //   googleAuthCallback
// // );

// // // Protected routes
// // router.get("/me", protect, getMe);

// // export default router;

// import express from "express";
// import passport from "passport";
// import { register, login, googleAuthCallback, getMe } from "../controllers/authController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // Local auth
// router.post("/register", register);
// router.post("/login", login);

// // Google OAuth
// router.get("/google", (req, res, next) => {
//   console.log("Initiating Google OAuth...");
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     session: false,
//   })(req, res, next);
// });

// router.get(
//   "/google/callback",
//   (req, res, next) => {
//     console.log("Google OAuth callback received");
//     passport.authenticate("google", {
//       failureRedirect: `${process.env.FRONTEND_URL}/auth/error`,
//       session: false,
//     })(req, res, next);
//   },
//   googleAuthCallback
// );

// // Test route to check if Google OAuth is configured
// router.get("/google/test", (req, res) => {
//   if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
//     return res.status(500).json({
//       success: false,
//       message: "Google OAuth credentials not configured",
//     });
//   }

//   res.json({
//     success: true,
//     message: "Google OAuth is configured",
//     clientId: process.env.GOOGLE_CLIENT_ID ? "Configured" : "Missing",
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "Configured" : "Missing",
//   });
// });

// // Protected routes
// router.get("/me", protect, getMe);

// export default router;

// routes/authRoutes.js
import express from "express";
import passport from "passport";
import { register, login, googleAuthCallback, getMe } from "../controllers/authController.js";
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
    failureRedirect: `${process.env.FRONTEND_URL}/auth/error`,
    session: false,
  }),
  googleAuthCallback
);

// Test routes
router.get("/test-config", (req, res) => {
  res.json({
    success: true,
    message: "Auth configuration check",
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: `${process.env.BACKEND_URL}/api/auth/google/callback`,
  });
});

router.get("/debug/google", (req, res) => {
  const config = {
    hasClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    clientId: process.env.GOOGLE_CLIENT_ID ? "✓ Configured" : "✗ Missing",
    callbackUrl: `${req.protocol}://${req.get("host")}/api/auth/google/callback`,
    frontendUrl: process.env.FRONTEND_URL,
  };

  console.log("Google OAuth Debug Info:", config);

  res.json({
    success: true,
    message: "Google OAuth Configuration Check",
    config,
  });
});

// Protected route (uses JWT strategy)
router.get("/me", protect, getMe);

export default router;
