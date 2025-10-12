// routes/blogPostRoutes.js
import express from "express";
import {
  getAllBlogPosts,
  createBlogPost,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostsByTag,
  searchBlogPosts,
  getPaginatedBlogPosts,
  incrementViewCount,
  incrementViewCountSession, // Add this
  likeBlogPost,
  unlikeBlogPost,
  toggleLike,
  getPopularPosts,
  getMyDrafts,
} from "../controllers/blogPostController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// View and Like routes
router.post("/:id/views", incrementViewCount);
router.post("/:id/views/session", incrementViewCountSession); // Alternative endpoint
router.post("/:id/like", likeBlogPost);
router.post("/:id/unlike", unlikeBlogPost);
router.post("/:id/toggle-like", toggleLike);
router.get("/popular", getPopularPosts);

// Existing routes
router.get("/tags/:tag", getBlogPostsByTag);
router.get("/search", searchBlogPosts);
router.get("/paginated/:page/:limit", getPaginatedBlogPosts);
router.get("", getAllBlogPosts);
router.get("/:id", getBlogPostById);


// Protected routes
router.post("/", protect, createBlogPost);
router.put("/:id", protect, updateBlogPost);
router.delete("/:id", protect, deleteBlogPost);
router.get("/my/drafts", protect, getMyDrafts);

export default router;
