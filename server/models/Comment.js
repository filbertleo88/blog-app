import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // null for top-level comments
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Comment", commentSchema);
