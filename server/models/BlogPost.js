// const mongoose = require('mongoose');

// const blogPostSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   content: { type: String, required: true },
//   author: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('BlogPost', blogPostSchema);

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
  tags: {
    type: [String],
    default: [],
  },
  author: {
    name: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
  },
  date: {
    type: String, // Storing formatted string like “Oct 8, 2025”
    default: () =>
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export model
const BlogPost = mongoose.model("BlogPost", blogPostSchema);
export default BlogPost;
