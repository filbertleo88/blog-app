// routes/uploadRoutes.js - Make sure this is working
import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Return the full URL for the uploaded image
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
    });
  }
});

export default router;
