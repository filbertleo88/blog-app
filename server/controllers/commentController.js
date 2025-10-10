import Comment from "../models/Comment.js";

// Get all comments for a post (with replies populated)
export const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({
      postId,
      parentId: null, // Only get top-level comments
    })
      .populate({
        path: "replies",
        populate: {
          path: "replies", // Populate nested replies
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      message: "Server error while fetching comments",
      error: error.message,
    });
  }
};

// Create a new comment or reply
export const createComment = async (req, res) => {
  try {
    const { postId, user, text, avatar, parentId } = req.body;

    const newComment = new Comment({
      postId,
      user,
      text,
      avatar: avatar || "https://i.pravatar.cc/50?img=7",
      parentId: parentId || null,
    });

    const savedComment = await newComment.save();

    // If this is a reply, add it to the parent's replies array
    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $push: { replies: savedComment._id },
      });
    }

    // Populate the saved comment for response
    const populatedComment = await Comment.findById(savedComment._id).populate({
      path: "replies",
      populate: {
        path: "replies",
      },
    });

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(400).json({
      message: "Error creating comment",
      error: error.message,
    });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(id, { text }, { new: true, runValidators: true }).populate({
      path: "replies",
      populate: {
        path: "replies",
      },
    });

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(400).json({
      message: "Error updating comment",
      error: error.message,
    });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // If this comment has a parent, remove it from parent's replies
    if (deletedComment.parentId) {
      await Comment.findByIdAndUpdate(deletedComment.parentId, {
        $pull: { replies: deletedComment._id },
      });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      message: "Error deleting comment",
      error: error.message,
    });
  }
};
