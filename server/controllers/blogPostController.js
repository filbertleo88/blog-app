// controllers/blogPostController.js
import BlogPost from "../models/BlogPost.js";

export const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    const posts = await BlogPost.find({
      tags: {
        $regex: tag,
        $options: "i",
      },
    }).sort({ createdAt: -1 });

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

export const createBlogPost = async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const blogPost = new BlogPost({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content || "",
      image: req.body.image || "",
      tags: req.body.tags || [],
      author: {
        name: req.body.author.name,
        avatar: req.body.author.avatar || `https://i.pravatar.cc/50?${req.body.author.name}`,
      },
      views: req.body.views || 0,
      likes: req.body.likes || 0,
    });

    const newBlogPost = await blogPost.save();
    console.log("Blog post saved successfully");

    res.status(201).json(newBlogPost);
  } catch (error) {
    console.error("Validation error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: messages,
      });
    }

    res.status(400).json({
      message: error.message,
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

export const getPaginatedBlogPosts = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 4;
    const skip = (page - 1) * limit;

    const posts = await BlogPost.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    const totalPosts = await BlogPost.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Like a blog post
export const likeBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // You can use user ID, IP address, or session ID

    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Check if user already liked this post
    if (blogPost.likedBy.includes(userId)) {
      return res.status(400).json({
        message: "You have already liked this post",
        likes: blogPost.likes,
      });
    }

    // Add user to likedBy array and increment likes
    blogPost.likedBy.push(userId);
    blogPost.likes += 1;
    await blogPost.save();

    res.json({
      likes: blogPost.likes,
      message: "Post liked successfully",
    });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: error.message });
  }
};

// NEW: Unlike a blog post
export const unlikeBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Check if user has liked this post
    if (!blogPost.likedBy.includes(userId)) {
      return res.status(400).json({
        message: "You haven't liked this post yet",
        likes: blogPost.likes,
      });
    }

    // Remove user from likedBy array and decrement likes
    blogPost.likedBy = blogPost.likedBy.filter((user) => user !== userId);
    blogPost.likes = Math.max(0, blogPost.likes - 1);
    await blogPost.save();

    res.json({
      likes: blogPost.likes,
      message: "Post unliked successfully",
    });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update incrementViewCount to prevent duplicate counts
export const incrementViewCount = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, sessionId } = req.body;

    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Initialize viewedBy array if it doesn't exist
    if (!blogPost.viewedBy) {
      blogPost.viewedBy = [];
    }

    // Create a unique identifier for this view
    // Prefer userId if available, otherwise use sessionId
    const viewerId = userId || sessionId;

    if (!viewerId) {
      return res.status(400).json({
        message: "User ID or session ID is required",
      });
    }

    // Check if this user/session has already viewed this post
    const hasViewed = blogPost.viewedBy.includes(viewerId);

    if (!hasViewed) {
      // Increment views and add to viewedBy array
      blogPost.views += 1;
      blogPost.viewedBy.push(viewerId);
      await blogPost.save();

      res.json({
        views: blogPost.views,
        message: "View count updated successfully",
        firstView: true,
      });
    } else {
      // User has already viewed this post
      res.json({
        views: blogPost.views,
        message: "View already counted",
        firstView: false,
      });
    }
  } catch (error) {
    console.error("Error incrementing view count:", error);
    res.status(500).json({ message: error.message });
  }
};

// Alternative: Session-based view counting (no authentication required)
export const incrementViewCountSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        message: "Session ID is required",
      });
    }

    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Initialize viewedBy array if it doesn't exist
    if (!blogPost.viewedBy) {
      blogPost.viewedBy = [];
    }

    // Check if this session has already viewed this post
    const hasViewed = blogPost.viewedBy.includes(`session_${sessionId}`);

    if (!hasViewed) {
      // Increment views and add session to viewedBy array
      blogPost.views += 1;
      blogPost.viewedBy.push(`session_${sessionId}`);
      await blogPost.save();

      res.json({
        views: blogPost.views,
        message: "View count updated successfully",
        firstView: true,
      });
    } else {
      // Session has already viewed this post
      res.json({
        views: blogPost.views,
        message: "View already counted for this session",
        firstView: false,
      });
    }
  } catch (error) {
    console.error("Error incrementing view count:", error);
    res.status(500).json({ message: error.message });
  }
};

// Updated toggleLike function - fix authentication check
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    console.log("Toggle like request:", { postId: id, userId });

    // Check if this is a visitor ID (starts with "visitor_" or "session_")
    const isVisitor = userId && (userId.startsWith("visitor_") || userId.startsWith("session_"));

    if (isVisitor) {
      return res.status(401).json({
        message: "Please login to like posts",
        requiresAuth: true,
      });
    }

    // Check if userId is provided and valid
    if (!userId || userId.trim() === "") {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Initialize likedBy array if it doesn't exist
    if (!blogPost.likedBy) {
      blogPost.likedBy = [];
    }

    // Convert both to string for comparison
    const userIdStr = userId.toString();
    const hasLiked = blogPost.likedBy.some((likedUserId) => likedUserId.toString() === userIdStr);

    if (hasLiked) {
      // Unlike the post
      blogPost.likedBy = blogPost.likedBy.filter((likedUserId) => likedUserId.toString() !== userIdStr);
      blogPost.likes = Math.max(0, blogPost.likes - 1);
    } else {
      // Like the post
      blogPost.likedBy.push(userId);
      blogPost.likes += 1;
    }

    await blogPost.save();

    console.log("Like toggle successful:", {
      postId: id,
      userId: userId,
      newLikes: blogPost.likes,
      hasLiked: !hasLiked,
    });

    res.json({
      likes: blogPost.likes,
      hasLiked: !hasLiked,
      message: hasLiked ? "Post unliked successfully" : "Post liked successfully",
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// NEW: Get popular posts (most viewed/liked)
export const getPopularPosts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const popularPosts = await BlogPost.find()
      .sort({
        views: -1,
        likes: -1,
      })
      .limit(parseInt(limit));

    res.json(popularPosts);
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    res.status(500).json({ message: error.message });
  }
};
