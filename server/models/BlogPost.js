// models/BlogPost.js - UPDATED VERSION
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

  // ADD STATUS FIELD
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
    required: true,
  },

  author: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Changed to true - author ID is required
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      default: "",
    },
  },

  // ADD SEPARATE AUTHOR_ID FIELD FOR EASIER QUERIES
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

  // Ensure author_id matches author._id
  if (this.author && this.author._id && !this.author_id) {
    this.author_id = this.author._id;
  }

  next();
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);
export default BlogPost;
