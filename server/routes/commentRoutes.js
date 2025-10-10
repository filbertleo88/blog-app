import express from "express";
import { getCommentsByPostId, createComment, updateComment, deleteComment } from "../controllers/commentController.js";

const router = express.Router();

router.get("/post/:postId", getCommentsByPostId);
router.post("", createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
