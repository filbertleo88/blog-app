// // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // import User from "../models/User.js";
// // import dotenv from "dotenv";

// // dotenv.config();

// // export const googleStrategy = new GoogleStrategy(
// //   {
// //     clientID: process.env.GOOGLE_CLIENT_ID,
// //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //     callbackURL: "/api/auth/google/callback",
// //   },
// //   async (accessToken, refreshToken, profile, done) => {
// //     try {
// //       // Check if user already exists
// //       let user = await User.findOne({ googleId: profile.id });

// //       if (user) {
// //         return done(null, user);
// //       }

// //       // Check if user exists with same email
// //       user = await User.findOne({ email: profile.emails[0].value });

// //       if (user) {
// //         // Link Google account to existing user
// //         user.googleId = profile.id;
// //         await user.save();
// //         return done(null, user);
// //       }

// //       // Create new user
// //       user = await User.create({
// //         googleId: profile.id,
// //         name: profile.displayName,
// //         email: profile.emails[0].value,
// //         avatar: profile.photos[0].value,
// //         isVerified: true,
// //       });

// //       return done(null, user);
// //     } catch (error) {
// //       return done(error, null);
// //     }
// //   }
// // );

// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import User from "../models/User.js";
// import dotenv from "dotenv";

// dotenv.config();

// export const googleStrategy = new GoogleStrategy(
//   {
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
//     passReqToCallback: true,
//     scope: ["profile", "email"],
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       console.log("Google OAuth profile:", profile);

//       // Check if user already exists with this Google ID
//       let user = await User.findOne({ googleId: profile.id });

//       if (user) {
//         console.log("Existing user found:", user.email);
//         return done(null, user);
//       }

//       // Check if user exists with same email
//       user = await User.findOne({ email: profile.emails[0].value });

//       if (user) {
//         // Link Google account to existing user
//         console.log("Linking Google account to existing user:", user.email);
//         user.googleId = profile.id;
//         user.avatar = profile.photos[0].value;
//         await user.save();
//         return done(null, user);
//       }

//       // Create new user
//       console.log("Creating new user from Google OAuth");
//       user = await User.create({
//         googleId: profile.id,
//         name: profile.displayName,
//         email: profile.emails[0].value,
//         avatar: profile.photos[0].value,
//         isVerified: true,
//       });

//       console.log("New user created:", user.email);
//       return done(null, user);
//     } catch (error) {
//       console.error("Google OAuth error:", error);
//       return done(error, null);
//     }
//   }
// );

// // // Contoh Sir Latief
// // // Passport local strategy
// // passport.use(new LocalStrategy(
// //     async (username, password, done) => {
// //         try {
// //             // Cari user berdasarkan username
// //             const user = await User.findOne({ username });
// //             if (!user) {
// //                 return done(null, false, { message: "Incorrect username." });
// //             }
// //             // Cek password (kasus sederhana: plain text)
// //             if (user.password !== password) {
// //                 return done(null, false, { message: "Incorrect password." });
// //             }
// //             return done(null, user);
// //         } catch (err) {
// //             return done(err);
// //         }
// //     }
// // ));

// // // Serialisasi user ke sesi
// // passport.serializeUser((user, done) => {
// //     done(null, user.id);
// // });
// // passport.deserializeUser(async (id, done) => {
// //     try {
// //         const user = await User.findById(id);
// //         done(null, user);
// //     } catch (err) {
// //         done(err);
// //     }
// // });

// // // Route login dengan passport
// // app.post("/login", passport.authenticate("local"), (req, res) => {
// //     res.json({ message: "Login successful" });
// // });

// // // Middleware protection untuk route
// // function isAuthenticated(req, res, next) {
// //     if (req.isAuthenticated()) return next();
// //     res.status(401).json({ message: "Unauthorized" });
// // }

// // // Routes yang butuh login
// // app.get("/students", isAuthenticated, async (req, res) => {
// //     const students = await Student.find();
// //     res.json(students);
// // });

// // app.post("/students", isAuthenticated, async (req, res) => {
// //     const newStudent = new Student(req.body);
// //     await newStudent.save();
// //     res.json({ message: "Student added!" });
// // });

// config/googleOAuth.js
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
        // Create new user
        user = await User.create({
          name: profile.displayName || "Google User",
          email: email,
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
          password: await bcrypt.hash(Math.random().toString(36) + Date.now(), 10),
          googleId: profile.id,
        });
        console.log("New user created via Google OAuth:", user.email);
      } else {
        // Update existing user with Google ID if not set
        if (!user.googleId) {
          user.googleId = profile.id;
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
