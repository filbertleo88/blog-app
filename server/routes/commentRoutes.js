import express from 'express';
const router = express.Router({ mergeParams: true });
import { createComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createComment);

export default router;
