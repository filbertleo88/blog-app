// // // import User from "../models/User.js";
// // // import jwt from "jsonwebtoken";

// // // const generateToken = (userId) => {
// // //   return jwt.sign({ id: userId }, process.env.JWT_SECRET || "your-fallback-secret", {
// // //     expiresIn: "30d",
// // //   });
// // // };

// // // export const register = async (req, res) => {
// // //   try {
// // //     const { name, email, password } = req.body;

// // //     // Check if user exists
// // //     const existingUser = await User.findOne({ email });
// // //     if (existingUser) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "User already exists with this email",
// // //       });
// // //     }

// // //     // Create user
// // //     const user = await User.create({
// // //       name,
// // //       email,
// // //       password,
// // //     });

// // //     // Generate token
// // //     const token = generateToken(user._id);

// // //     res.status(201).json({
// // //       success: true,
// // //       message: "User registered successfully",
// // //       token,
// // //       user: {
// // //         id: user._id,
// // //         name: user.name,
// // //         email: user.email,
// // //         avatar: user.avatar,
// // //         role: user.role,
// // //       },
// // //     });
// // //   } catch (error) {
// // //     console.error("Registration error:", error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: "Server error during registration",
// // //     });
// // //   }
// // // };

// // // export const login = async (req, res) => {
// // //   try {
// // //     const { email, password } = req.body;

// // //     // Check if user exists
// // //     const user = await User.findOne({ email });
// // //     if (!user) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "Invalid email or password",
// // //       });
// // //     }

// // //     // Check password
// // //     const isPasswordValid = await user.comparePassword(password);
// // //     if (!isPasswordValid) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "Invalid email or password",
// // //       });
// // //     }

// // //     // Generate token
// // //     const token = generateToken(user._id);

// // //     res.json({
// // //       success: true,
// // //       message: "Login successful",
// // //       token,
// // //       user: {
// // //         id: user._id,
// // //         name: user.name,
// // //         email: user.email,
// // //         avatar: user.avatar,
// // //         role: user.role,
// // //       },
// // //     });
// // //   } catch (error) {
// // //     console.error("Login error:", error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: "Server error during login",
// // //     });
// // //   }
// // // };

// // // export const googleAuthCallback = async (req, res) => {
// // //   try {
// // //     if (!req.user) {
// // //       return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Authentication failed`);
// // //     }

// // //     const token = generateToken(req.user._id);

// // //     // Redirect to frontend with token
// // //     const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`;
// // //     console.log("Redirecting to:", redirectUrl);
// // //     res.redirect(redirectUrl);
// // //   } catch (error) {
// // //     console.error("Google auth callback error:", error);
// // //     res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Server error`);
// // //   }
// // // };

// // // export const getMe = async (req, res) => {
// // //   try {
// // //     res.json({
// // //       success: true,
// // //       user: req.user,
// // //     });
// // //   } catch (error) {
// // //     console.error("Get user error:", error);
// // //     res.status(500).json({
// // //       success: false,
// // //       message: "Server error",
// // //     });
// // //   }
// // // };

// // // controllers/authController.js
// // import User from "../models/User.js";
// // import jwt from "jsonwebtoken";

// // const generateToken = (userId) => {
// //   return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
// //     expiresIn: "30d",
// //   });
// // };

// // export const register = async (req, res) => {
// //   try {
// //     const { name, email, password } = req.body;

// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "User already exists with this email",
// //       });
// //     }

// //     const user = await User.create({ name, email, password });
// //     const token = generateToken(user._id);

// //     res.status(201).json({
// //       success: true,
// //       message: "User registered successfully",
// //       token,
// //       user: {
// //         id: user._id,
// //         name: user.name,
// //         email: user.email,
// //         avatar: user.avatar,
// //         role: user.role,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Registration error:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Server error during registration",
// //     });
// //   }
// // };

// // export const login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid email or password",
// //       });
// //     }

// //     const isPasswordValid = await user.comparePassword(password);
// //     if (!isPasswordValid) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid email or password",
// //       });
// //     }

// //     const token = generateToken(user._id);

// //     res.json({
// //       success: true,
// //       message: "Login successful",
// //       token,
// //       user: {
// //         id: user._id,
// //         name: user.name,
// //         email: user.email,
// //         avatar: user.avatar,
// //         role: user.role,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Login error:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Server error during login",
// //     });
// //   }
// // };

// // export const googleAuthCallback = (req, res) => {
// //   try {
// //     if (!req.user) {
// //       throw new Error("No user data from Google OAuth");
// //     }

// //     const token = generateToken(req.user._id);

// //     const userData = {
// //       id: req.user._id,
// //       name: req.user.name,
// //       email: req.user.email,
// //       avatar: req.user.avatar,
// //       role: req.user.role,
// //     };

// //     const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;

// //     console.log("Google OAuth successful, redirecting to frontend");
// //     res.redirect(redirectUrl);
// //   } catch (error) {
// //     console.error("Google auth callback error:", error);
// //     const errorUrl = `${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(error.message || "Authentication failed")}`;
// //     res.redirect(errorUrl);
// //   }
// // };

// // export const getMe = async (req, res) => {
// //   try {
// //     res.json({
// //       success: true,
// //       user: req.user,
// //     });
// //   } catch (error) {
// //     console.error("Get user error:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Server error",
// //     });
// //   }
// // };

// // controllers/authController.js
// import User from "../models/User.js";
// import jwt from "jsonwebtoken";

// const generateToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//     expiresIn: "30d",
//   });
// };

// export const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists with this email",
//       });
//     }

//     const user = await User.create({ name, email, password });
//     const token = generateToken(user._id);

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         avatar: user.avatar,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error during registration",
//     });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     const isPasswordValid = await user.comparePassword(password);
//     if (!isPasswordValid) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     const token = generateToken(user._id);

//     res.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         avatar: user.avatar,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error during login",
//     });
//   }
// };

// export const googleAuthCallback = (req, res) => {
//   try {
//     if (!req.user) {
//       console.error("No user data from Google OAuth");
//       return res.redirect(`${process.env.FRONTEND_URL}/?auth=error&message=Authentication failed`);
//     }

//     const token = generateToken(req.user._id);

//     const userData = {
//       id: req.user._id,
//       name: req.user.name,
//       email: req.user.email,
//       avatar: req.user.avatar,
//       role: req.user.role,
//     };

//     // Encode the user data properly
//     const encodedUserData = encodeURIComponent(JSON.stringify(userData));

//     // Redirect to frontend with token and user data as query parameters
//     const redirectUrl = `${process.env.FRONTEND_URL}/?auth=success&token=${token}&user=${encodedUserData}`;

//     console.log("Google OAuth successful, redirecting to:", redirectUrl);
//     res.redirect(redirectUrl);
//   } catch (error) {
//     console.error("Google auth callback error:", error);
//     const errorUrl = `${process.env.FRONTEND_URL}/?auth=error&message=${encodeURIComponent(error.message || "Authentication failed")}`;
//     res.redirect(errorUrl);
//   }
// };

// export const getMe = async (req, res) => {
//   try {
//     res.json({
//       success: true,
//       user: req.user,
//     });
//   } catch (error) {
//     console.error("Get user error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user has a password (Google OAuth users might not have one)
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
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

export const googleAuthCallback = (req, res) => {
  try {
    console.log("Google OAuth callback - user:", req.user);

    if (!req.user) {
      console.error("No user data in Google OAuth callback");
      return res.redirect(`${process.env.FRONTEND_URL}/?auth=error&message=Authentication failed`);
    }

    const token = generateToken(req.user._id);

    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role,
    };

    const encodedUserData = encodeURIComponent(JSON.stringify(userData));
    const redirectUrl = `${process.env.FRONTEND_URL}/?auth=success&token=${token}&user=${encodedUserData}`;

    console.log("Google OAuth successful, redirecting to:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google auth callback error:", error);
    const errorUrl = `${process.env.FRONTEND_URL}/?auth=error&message=${encodeURIComponent(error.message || "Authentication failed")}`;
    res.redirect(errorUrl);
  }
};

export const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
