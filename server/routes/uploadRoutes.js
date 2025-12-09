// // routes/uploadRoutes.js - UPDATED VERSION
// import express from "express";
// import upload from "../middleware/upload.js";

// const router = express.Router();

// router.post("/", upload.single("image"), (req, res) => {
//   try {
//     console.log("=== UPLOAD ROUTE CALLED ===");
//     console.log("Request file:", req.file);
//     console.log("File path property:", req.file?.path);
//     console.log("Is Cloudinary URL?", req.file?.path?.includes("cloudinary.com"));

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No image file provided",
//       });
//     }

//     const imageUrl = req.file.path;
//     console.log("✅ Image URL to return:", imageUrl);

//     res.status(200).json({
//       success: true,
//       message: "Image uploaded successfully",
//       imageUrl: imageUrl,
//       filename: req.file.filename,
//       cloudinary: {
//         public_id: req.file.filename,
//         url: req.file.path,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Upload error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error uploading image",
//       error: error.message,
//     });
//   }
// });

// export default router;

// routes/uploadRoutes.js - REVISED VERSION with Cloudinary upload_stream
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage (we'll stream to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed!"));
    }
  },
});

// Main upload endpoint using Cloudinary upload_stream
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("=== CLOUDINARY UPLOAD ROUTE CALLED ===");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    console.log("File received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Upload to Cloudinary using upload_stream
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "blog-images",
          allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
          transformation: [{ width: 1200, height: 630, crop: "limit" }],
          public_id: Date.now() + "-" + Math.round(Math.random() * 1e9),
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Write the buffer to the stream
      stream.end(req.file.buffer);
    });

    console.log("✅ Cloudinary upload successful:", {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
    });

    res.status(200).json({
      success: true,
      message: "Image uploaded to Cloudinary successfully",
      imageUrl: result.secure_url,
      filename: result.public_id,
      cloudinary: {
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image to Cloudinary",
      error: error.message,
    });
  }
});

export default router;
