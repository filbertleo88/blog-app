// middleware/authMiddleware.js - Updated to handle both userId and id
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔍 AUTH MIDDLEWARE - Decoded token:", decoded);

      // Handle both userId and id in the token
      const userId = decoded.userId || decoded.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, invalid token payload",
        });
      }

      // Check if user still exists
      const user = await User.findById(userId).select("-password");
      if (!user) {
        console.log("🔍 AUTH MIDDLEWARE - User not found in database for ID:", userId);
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      req.userId = user._id;
      req.user = user;
      console.log("🔍 AUTH MIDDLEWARE - Authentication successful for user:", user._id);
      next();
    } catch (error) {
      console.error("🔍 AUTH MIDDLEWARE - Token verification error:", error);
      return res.status(401).json({
        success: false,
        message: "Not authorized, invalid token",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};
