// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto"; // ADD THIS IMPORT AT THE TOP

// Register with email/password
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create user - password will be hashed by pre-save middleware
    const user = new User({
      name,
      email,
      password, // This will be hashed by the pre-save middleware
      username: username || name.toLowerCase().replace(/\s+/g, "") + Math.random().toString(36).substr(2, 5),
      avatar: "", // Empty string for non-Google users
      authProvider: "email",
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        authProvider: user.authProvider,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user has a password
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Please use Google OAuth to login",
      });
    }

    // TEMPORARY FIX: Handle both hashed and unhashed passwords during transition
    let isPasswordValid;

    try {
      // First try to compare as bcrypt hash
      isPasswordValid = await user.comparePassword(password);
    } catch (compareError) {
      console.log("Bcrypt compare failed, checking if password is unhashed:", compareError.message);

      // If bcrypt compare fails, check if it's an unhashed password (for migration)
      if (user.password === password) {
        // Password matches as plain text - hash it now
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        console.log(`Migrated password for user: ${user.email}`);
        isPasswordValid = true;
      } else {
        isPasswordValid = false;
      }
    }

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        authProvider: user.authProvider,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

// Google OAuth Callback
export const googleAuthCallback = async (req, res) => {
  try {
    console.log("✅ Google OAuth callback triggered");

    if (!req.user) {
      console.error("❌ No user data in Google OAuth callback");
      return res.redirect(`${process.env.FRONTEND_URL}/?auth=failed`);
    }

    const token = generateToken(req.user._id);

    const userData = {
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar || "",
      authProvider: req.user.authProvider || "google",
      role: req.user.role || "user",
    };

    const encodedUserData = encodeURIComponent(JSON.stringify(userData));

    // ✅ Redirect to dedicated callback route on frontend
    const redirectUrl = `${process.env.FRONTEND_URL}?auth=success&token=${token}&user=${encodedUserData}`;

    console.log("✅ Redirecting to:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("❌ Google auth callback error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/?auth=failed`);
  }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
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
        username: user.username,
        avatar: user.avatar,
        authProvider: user.authProvider,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    console.log("Updating profile for user:", req.userId);
    console.log("Update data:", { name, email, avatar: avatar ? "has avatar" : "no avatar" });

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.userId },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken by another user",
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (avatar) updateData.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Profile updated successfully:", updatedUser);

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        authProvider: updatedUser.authProvider,
        role: updatedUser.role,
        username: updatedUser.username,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email or username already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during profile update",
      error: error.message,
    });
  }
};

// Test route for debugging
export const testConfig = (req, res) => {
  res.json({
    success: true,
    message: "Auth configuration check",
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: `${process.env.BACKEND_URL}/api/auth/google/callback`,
  });
};

// Debug Google OAuth
export const debugGoogle = (req, res) => {
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
};
