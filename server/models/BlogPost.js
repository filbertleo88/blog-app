// models/BlogPost.js - Fixed version
import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: 5,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: 20,
  },
  content: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    default: "",
  },
  tags: {
    type: [String],
    default: [],
  },
  author: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Changed to false for flexibility
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false, // Changed to false for flexibility
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  date: {
    type: String,
    default: () =>
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: [String],
    default: [],
  },
  viewedBy: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
blogPostSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);
export default BlogPost;
