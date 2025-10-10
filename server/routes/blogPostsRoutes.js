// import express from "express";
// import { getAllBlogPosts, createBlogPost, getBlogPostById, updateBlogPost, deleteBlogPost, getBlogPostsByTag, searchBlogPosts, getPaginatedBlogPosts } from "../controllers/blogPostController.js";

// const router = express.Router();

// // Add the tag route - make sure this comes BEFORE the /:id route
// router.get("/tags/:tag", getBlogPostsByTag);
// router.get("/search", searchBlogPosts); // Add this line

// router.get("", getAllBlogPosts);
// router.post("", createBlogPost);
// router.get("/:id", getBlogPostById);
// router.put("/:id", updateBlogPost);
// router.delete("/:id", deleteBlogPost);

// // Add paginated posts route
// router.get("/paginated/:page/:limit", getPaginatedBlogPosts);

// export default router;

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
  likeBlogPost,
  unlikeBlogPost,
  toggleLike,
  getPopularPosts,
} from "../controllers/blogPostController.js";

const router = express.Router();

// View and Like routes
router.post("/:id/views", incrementViewCount);
router.post("/:id/like", likeBlogPost);
router.post("/:id/unlike", unlikeBlogPost);
router.post("/:id/toggle-like", toggleLike);
router.get("/popular", getPopularPosts);

// Existing routes
router.get("/tags/:tag", getBlogPostsByTag);
router.get("/search", searchBlogPosts);
router.get("/paginated/:page/:limit", getPaginatedBlogPosts);
router.get("", getAllBlogPosts);
router.post("", createBlogPost);
router.get("/:id", getBlogPostById);
router.put("/:id", updateBlogPost);
router.delete("/:id", deleteBlogPost);

export default router;
