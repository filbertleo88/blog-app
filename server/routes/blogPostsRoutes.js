import express from "express";
import { getAllBlogPosts, createBlogPost, getBlogPostById, updateBlogPost, deleteBlogPost, getBlogPostsByTag, searchBlogPosts } from "../controllers/blogPostController.js";

const router = express.Router();

// Add the tag route - make sure this comes BEFORE the /:id route
router.get("/tags/:tag", getBlogPostsByTag);
router.get("/search", searchBlogPosts); // Add this line

router.get("", getAllBlogPosts);
router.post("", createBlogPost);
router.get("/:id", getBlogPostById);
router.put("/:id", updateBlogPost);
router.delete("/:id", deleteBlogPost);

export default router;
