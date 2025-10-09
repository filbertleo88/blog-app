import express from "express";
import { getAllBlogPosts, createBlogPost, getBlogPostById, updateBlogPost, deleteBlogPost, getBlogPostsByTag } from "../controllers/blogPostController.js";

const router = express.Router();

router.get("", getAllBlogPosts);
router.post("", createBlogPost);
router.get("/:id", getBlogPostById);
router.put("/:id", updateBlogPost);
router.delete("/:id", deleteBlogPost);

// Add the tag route - make sure this comes BEFORE the /:id route
router.get("/tags/:tag", getBlogPostsByTag);

router.get(
  "/tags/:tag",
  (req, res, next) => {
    console.log("Tag route hit:", req.params.tag);
    next();
  },
  getBlogPostsByTag
);

export default router;
