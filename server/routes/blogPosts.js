import express from 'express';
import {
  getAllBlogPosts,
  createBlogPost,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
} from '../controllers/blogPostController.js';

const router = express.Router();

router.get('/', getAllBlogPosts);
router.post('/', createBlogPost);
router.get('/:id', getBlogPostById);
router.put('/:id', updateBlogPost);
router.delete('/:id', deleteBlogPost);

export default router;
