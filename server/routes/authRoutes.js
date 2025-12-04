// routes/authRoutes.js
import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import { register, login, googleAuthCallback, getCurrentUser, updateProfile, testConfig, debugGoogle } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const router = express.Router();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Local authentication
router.post("/register", register);
router.post("/login", login);

// Forgot Password - Send OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP
    otpStore.set(email, {
      otp,
      expiresAt,
    });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP - Inkspire",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You have requested to reset your password. Use the OTP below to reset your password:</p>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
            <h1 style="color: #333; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <br>
          <p>Best regards,<br>Inkspire Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

// Reset Password with OTP - FIXED VERSION
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    console.log("🔐 Reset password request:", { email, otp, newPassword: newPassword ? "***" : "missing" });

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if new password meets requirements
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Check if OTP exists and is valid
    const storedOtpData = otpStore.get(email);
    if (!storedOtpData) {
      console.log("❌ OTP not found for email:", email);
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // Check if OTP is expired
    if (new Date() > storedOtpData.expiresAt) {
      otpStore.delete(email);
      console.log("❌ OTP expired for email:", email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Check if OTP matches
    if (storedOtpData.otp !== otp) {
      console.log("❌ Invalid OTP for email:", email, "Expected:", storedOtpData.otp, "Received:", otp);
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ User found:", user.email);
    console.log("   Current password hash:", user.password ? "***" + user.password.slice(-8) : "none");

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    console.log("   New password hash to save:", "***" + hashedPassword.slice(-8));

    // Update user password
    user.password = hashedPassword;

    // Save and wait for completion
    await user.save();
    console.log("✅ User saved successfully");

    // Remove used OTP
    otpStore.delete(email);

    // 🔄 FIX: Force a fresh database query to verify the update
    const updatedUser = await User.findOne({ email }).select("password");

    if (!updatedUser) {
      console.log("❌ Could not find updated user");
      return res.status(500).json({
        success: false,
        message: "Password update verification failed",
      });
    }

    console.log("   Fresh user password hash:", updatedUser.password ? "***" + updatedUser.password.slice(-8) : "none");

    // Verify the update by comparing with the freshly fetched user
    const isPasswordUpdated = await bcrypt.compare(newPassword, updatedUser.password);

    console.log("🔍 Password update verification:", isPasswordUpdated ? "SUCCESS" : "FAILED");

    if (!isPasswordUpdated) {
      console.log("❌ Password verification failed - hashes don't match");
      console.log("   Input password:", newPassword);
      console.log("   Stored hash:", updatedUser.password);

      // Additional debug: compare with the original hashed password
      const directComparison = await bcrypt.compare(newPassword, hashedPassword);
      console.log("   Direct comparison with original hash:", directComparison);
    }

    res.json({
      success: true,
      message: "Password reset successfully",
      verified: isPasswordUpdated,
    });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
      error: error.message,
    });
  }
});

// Verify OTP (optional endpoint for frontend validation)
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Check if OTP exists and is valid
    const storedOtpData = otpStore.get(email);
    if (!storedOtpData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // Check if OTP is expired
    if (new Date() > storedOtpData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Check if OTP matches
    if (storedOtpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store new OTP
    otpStore.set(email, {
      otp,
      expiresAt,
    });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "New Password Reset OTP - Inkspire",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Password Reset OTP</h2>
          <p>Hello ${user.name},</p>
          <p>You have requested a new OTP. Use the OTP below to reset your password:</p>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
            <h1 style="color: #333; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <br>
          <p>Best regards,<br>Inkspire Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "New OTP sent to your email",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

// Google OAuth
router.get(
  "/google",
  (req, res, next) => {
    console.log("🔍 Starting Google OAuth flow...");
    console.log("   Client ID:", process.env.GOOGLE_CLIENT_ID ? "Set" : "Missing");
    console.log("   Callback URL:", "/api/auth/google/callback");
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account", // Optional: forces account selection
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=google_auth_failed`,
    session: false,
  }),
  googleAuthCallback
);

// Protected routes
router.get("/me", protect, getCurrentUser);
router.put("/profile", protect, updateProfile);

// Get user by ID
router.get("/user/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Test routes
router.get("/test-config", testConfig);
router.get("/debug/google", debugGoogle);

export default router;
