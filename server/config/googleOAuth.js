// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import User from "../models/User.js";
// import dotenv from "dotenv";

// dotenv.config();

// export const googleStrategy = new GoogleStrategy(
//   {
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/api/auth/google/callback",
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       // Check if user already exists
//       let user = await User.findOne({ googleId: profile.id });

//       if (user) {
//         return done(null, user);
//       }

//       // Check if user exists with same email
//       user = await User.findOne({ email: profile.emails[0].value });

//       if (user) {
//         // Link Google account to existing user
//         user.googleId = profile.id;
//         await user.save();
//         return done(null, user);
//       }

//       // Create new user
//       user = await User.create({
//         googleId: profile.id,
//         name: profile.displayName,
//         email: profile.emails[0].value,
//         avatar: profile.photos[0].value,
//         isVerified: true,
//       });

//       return done(null, user);
//     } catch (error) {
//       return done(error, null);
//     }
//   }
// );

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("Google OAuth profile:", profile);

      // Check if user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        console.log("Existing user found:", user.email);
        return done(null, user);
      }

      // Check if user exists with same email
      user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // Link Google account to existing user
        console.log("Linking Google account to existing user:", user.email);
        user.googleId = profile.id;
        user.avatar = profile.photos[0].value;
        await user.save();
        return done(null, user);
      }

      // Create new user
      console.log("Creating new user from Google OAuth");
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        isVerified: true,
      });

      console.log("New user created:", user.email);
      return done(null, user);
    } catch (error) {
      console.error("Google OAuth error:", error);
      return done(error, null);
    }
  }
);
