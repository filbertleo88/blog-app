// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create user with empty avatar
    const user = new User({
      name,
      email,
      password,
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

    const isPasswordValid = await user.comparePassword(password);
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

// // Google OAuth Callback - WITH AVATAR SUPPORT
// Google OAuth Callback - WITH AVATAR SUPPORT (REVISED)
export const googleAuthCallback = async (req, res) => {
  try {
    console.log("✅ Google OAuth callback triggered");
    console.log("   User data received:", req.user ? "Yes" : "No");

    if (!req.user) {
      console.error("❌ No user data in Google OAuth callback");
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=no_user_data`);
    }

    // Log user info for debugging
    console.log("   User ID:", req.user._id);
    console.log("   User email:", req.user.email);
    console.log("   User avatar:", req.user.avatar ? "Exists" : "No avatar");

    // Generate JWT token
    const token = generateToken(req.user._id);
    console.log("   Token generated:", token ? "Yes" : "No");

    // Create user data for frontend
    const userData = {
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar || "", // Include avatar directly if not too large
      authProvider: req.user.authProvider || "google",
      role: req.user.role || "user",
    };

    // For development, use in-memory storage
    // For production, consider using:
    // 1. Redis (recommended)
    // 2. JWT token with avatar data
    // 3. Temporary database collection

    const sessionId = crypto.randomBytes(16).toString("hex");

    // Store avatar in temporary session (5 minute expiry)
    global.authSessions = global.authSessions || new Map();
    global.authSessions.set(sessionId, {
      userId: req.user._id.toString(),
      avatar: req.user.avatar,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // Cleanup old sessions (optional, for memory management)
    if (global.authSessions.size > 100) {
      const now = Date.now();
      for (const [key, value] of global.authSessions.entries()) {
        if (value.expires < now) {
          global.authSessions.delete(key);
        }
      }
    }

    // Add session ID to user data
    userData.sessionId = sessionId;

    // Encode user data for URL
    const encodedUserData = encodeURIComponent(JSON.stringify(userData));

    // Create redirect URL with token and user data
    const redirectUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/callback?token=${token}&user=${encodedUserData}`;

    console.log("✅ Google OAuth successful");
    console.log("   Redirecting to:", redirectUrl.replace(token, "TOKEN_HIDDEN"));
    console.log("   Session ID:", sessionId);
    console.log("   Avatar URL:", req.user.avatar || "No avatar");

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("❌ Google auth callback error:", error);

    // Create error redirect URL
    const errorMessage = encodeURIComponent(error.message || "Google authentication failed");

    const errorUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=google_auth_failed&message=${errorMessage}`;

    console.log("   Redirecting to error page:", errorUrl);
    res.redirect(errorUrl);
  }
};

// export const googleAuthCallback = async (req, res) => {
//   try {
//     console.log("Google OAuth callback - user:", req.user);

//     if (!req.user) {
//       console.error("No user data in Google OAuth callback");
//       return res.redirect(`${process.env.FRONTEND_URL}/?auth=error&message=Authentication failed`);
//     }

//     const token = generateToken(req.user._id);

//     // Store avatar in temporary session storage (Redis or in-memory)
//     const authSession = {
//       userId: req.user._id.toString(),
//       avatar: req.user.avatar, // Store avatar separately
//       expires: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
//     };

//     // Simple in-memory storage (for development)
//     // In production, use Redis or database
//     global.authSessions = global.authSessions || new Map();
//     const sessionId = `auth_${req.user._id}_${Date.now()}`;
//     global.authSessions.set(sessionId, authSession);

//     // Minimal data in URL
//     const minimalUserData = {
//       id: req.user._id,
//       name: req.user.name,
//       email: req.user.email,
//       authProvider: req.user.authProvider || "google",
//       role: req.user.role,
//       sessionId: sessionId, // Pass session ID to retrieve avatar
//     };

//     const encodedUserData = encodeURIComponent(JSON.stringify(minimalUserData));
//     const redirectUrl = `${process.env.FRONTEND_URL}/?auth=success&token=${token}&user=${encodedUserData}`;

//     console.log("Google OAuth successful, redirecting with avatar session");
//     console.log("Avatar stored in session:", sessionId);

//     res.redirect(redirectUrl);
//   } catch (error) {
//     console.error("Google auth callback error:", error);
//     const errorUrl = `${process.env.FRONTEND_URL}/?auth=error&message=${encodeURIComponent(error.message || "Authentication failed")}`;
//     res.redirect(errorUrl);
//   }
// };

// Get Current User - ADD THIS FUNCTION
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

// Update User Profile - ADD THIS FUNCTION
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
