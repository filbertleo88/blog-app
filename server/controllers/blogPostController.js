import BlogPost from "../models/BlogPost.js";

export const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBlogPost = async (req, res) => {
  const blogPost = new BlogPost({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
  });

  try {
    const newBlogPost = await blogPost.save();
    res.status(201).json(newBlogPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (blogPost == null) {
      return res.status(404).json({ message: "Cannot find blog post" });
    }
    res.json(blogPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBlogPostsByTag = async (req, res) => {
  try {
    const { tag } = req.params;

    // Case-insensitive search for the tag
    const posts = await BlogPost.find({
      tags: {
        $regex: tag,
        $options: "i", // 'i' for case-insensitive
      },
    }).sort({ createdAt: -1 }); // Sort by newest first

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        message: `No posts found with tag: ${tag}`,
      });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    res.status(500).json({
      message: "Server error while fetching posts",
      error: error.message,
    });
  }
};

export const searchBlogPosts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Search in multiple fields
    const posts = await BlogPost.find({
      $or: [{ title: { $regex: q, $options: "i" } }, { description: { $regex: q, $options: "i" } }, { content: { $regex: q, $options: "i" } }, { tags: { $in: [new RegExp(q, "i")] } }],
    }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({
      message: "Server error while searching posts",
      error: error.message,
    });
  }
};

export const updateBlogPost = async (req, res) => {
  try {
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBlogPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBlogPost = async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
