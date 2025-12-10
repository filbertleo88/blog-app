import express from "express";
import { getUserProfile, updateUserProfile, getUserPost } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/", registerUser);
// router.post("/login", authUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile); // Add this line
router.put("/posts", protect, getUserPost); 

export default router;
