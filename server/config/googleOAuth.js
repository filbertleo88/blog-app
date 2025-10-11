import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("Google OAuth profile received:", profile);

      // Check if profile data exists
      if (!profile || !profile.emails || !profile.emails[0]) {
        console.error("Invalid Google profile data:", profile);
        return done(new Error("Invalid Google profile data"), null);
      }

      const email = profile.emails[0].value;

      // Find existing user
      let user = await User.findOne({
        $or: [{ email: email }, { googleId: profile.id }],
      });

      if (!user) {
        // Create new user - use avatar URL directly (not base64)
        const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : "";

        user = await User.create({
          name: profile.displayName || "Google User",
          email: email,
          avatar: avatarUrl, // Store URL, not base64 data
          password: await bcrypt.hash(Math.random().toString(36) + Date.now(), 10),
          googleId: profile.id,
          authProvider: "google", // Add this field
        });
        console.log("New user created via Google OAuth:", user.email);
      } else {
        // Update existing user with Google ID if not set
        if (!user.googleId) {
          user.googleId = profile.id;
          user.authProvider = "google"; // Update auth provider

          // Update avatar if empty and Google has one
          if (!user.avatar && profile.photos && profile.photos[0]) {
            user.avatar = profile.photos[0].value;
          }

          await user.save();
        }
        console.log("Existing user found:", user.email);
      }

      return done(null, user);
    } catch (error) {
      console.error("Google OAuth strategy error:", error);
      return done(error, null);
    }
  }
);
