import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import BlogLayout from "../../../components/Layouts/BlogLayout/BlogLayout";
import ModernCommentSection from "../../../components/ModernCommentSection";
import MarkdownRenderer from "./common/MarkdownRenderer";
import API_BASE_URL from "../../../config/api";

const BlogPostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const getUserId = () => {
    const userData = localStorage.getItem("user");
    console.log("Raw user data from localStorage:", userData);

    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log("Parsed user object:", user);

        // Try different possible ID fields
        const userId = user.id || user.id || user.userId || user.email;
        console.log("Extracted user ID:", userId);

        if (!userId) {
          console.warn("No user ID found in user object");
        }

        return userId;
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // For non-authenticated users, return null instead of session ID
    // since the backend now requires authentication
    console.log("No authenticated user found");
    return null;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem("user");
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        console.log("Fetching post with ID:", id);

        // Fetch post data
        const response = await fetch(`${API_BASE_URL}/blogposts/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.status}`);
        }
        const data = await response.json();
        console.log("Post data received:", data);

        setPost(data);
        setLikeCount(data.likes || 0);
        setViewCount(data.views || 0);

        // Check if current user has liked this post
        const userId = getUserId();
        console.log("Checking like status for user:", userId);
        console.log("Post likedBy array:", data.likedBy);

        if (isAuthenticated() && data.likedBy && Array.isArray(data.likedBy)) {
          setIsLiked(data.likedBy.includes(userId));
        } else {
          setIsLiked(false);
        }

        // Increment view count
        await incrementViewCount();
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // Redirect to login/register
  const redirectToAuth = () => {
    navigate("/login", {
      state: {
        returnUrl: `/blogposts/${id}`,
        message: "Please login to like and comment on posts",
      },
    });
  };

  const incrementViewCount = async () => {
    try {
      const userId = getUserId();
      const sessionId = localStorage.getItem("blog_sessionId") || getUserId();

      const response = await fetch(`${API_BASE_URL}/blogposts/${id}/views`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: isAuthenticated() ? userId : null,
          sessionId: sessionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.views !== undefined) {
          setViewCount(data.views);
        }
      }
    } catch (error) {
      console.error("Failed to update view count:", error);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;

    // Check authentication first
    if (!isAuthenticated()) {
      toast.warning("Please login to like posts");
      redirectToAuth();
      return;
    }

    try {
      setIsLiking(true);
      const userId = getUserId();
      const token = localStorage.getItem("token");

      console.log("Sending like request:", {
        postId: id,
        userId: userId,
        isAuthenticated: isAuthenticated(),
      });

      const response = await fetch(`${API_BASE_URL}/blogposts/${id}/toggle-like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ userId }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);

        if (response.status === 401) {
          toast.warning("Please login to like posts");
          redirectToAuth();
          return;
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success response:", data);

      setLikeCount(data.likes);
      setIsLiked(data.hasLiked);
    } catch (error) {
      console.error("Failed to update like:", error);
      toast.error(error.message || "Failed to update like. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  // Handle comment action - redirect if not authenticated
  const handleCommentAction = () => {
    if (!isAuthenticated()) {
      redirectToAuth();
      return;
    }
    console.log("User can comment now");
  };

  // Update your ModernCommentSection to handle authentication
  const EnhancedCommentSection = () => {
    return (
      <div>
        <ModernCommentSection onCommentAction={handleCommentAction} isAuthenticated={isAuthenticated()} />
      </div>
    );
  };

  if (loading) {
    return (
      <BlogLayout user={user} posts={[]}>
        <div className="max-w-4xl mx-auto flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </BlogLayout>
    );
  }

  if (error) {
    return (
      <BlogLayout user={user} posts={[]}>
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="text-red-500 text-xl mb-4">Error Loading Post</div>
          <p className="text-gray-600">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Retry
          </button>
        </div>
      </BlogLayout>
    );
  }

  if (!post) {
    return (
      <BlogLayout user={user} posts={[]}>
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-600">Post not found.</p>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout user={user} posts={[]}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Blog Post Header */}
        <article className="mb-12">
          {/* Blog Post Image */}
          {post.image && (
            <div className="mb-8">
              <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg shadow-md" />
            </div>
          )}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">{post.title}</h1>
          <div className="text-gray-600 mb-8">
            <span>By {post.author?.name || "Unknown Author"}</span>
            <span className="mx-2">•</span>
            <span>{post.date || new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Post Content */}
          <div className="mb-8">
            <MarkdownRenderer content={post.content} className="prose-lg" />
          </div>
          <div className="mb-8">
            <MarkdownRenderer content={post.description} className="text-gray-700" />
          </div>

          {/* Tags */}
          <div className="mt-8">
            {post.tags &&
              post.tags.map((tag) => (
                <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  #{tag}
                </span>
              ))}
          </div>
        </article>

        {/* Comments Section */}
        <section className="border-t border-gray-200 pt-8">
          <EnhancedCommentSection />
        </section>
      </div>

      {/* Floating Post Stats */}
      <FloatingPostStats likeCount={likeCount} viewCount={viewCount} isLiked={isLiked} onLike={handleLike} isLiking={isLiking} isAuthenticated={isAuthenticated()} />
    </BlogLayout>
  );
};

// Updated Floating Post Stats Component with Authentication Check
const FloatingPostStats = ({ likeCount, viewCount, isLiked, onLike, isLiking, isAuthenticated }) => {
  const handleLikeClick = () => {
    if (!isAuthenticated) {
      toast.warning("Please login to like posts");
      return;
    }
    onLike();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="bg-gradient-to-r from-sky-400 to-cyan-500 text-white backdrop-blur-md rounded-2xl shadow-xl border border-white/20 px-4 py-3 flex items-center gap-4 transition-all duration-300 hover:scale-105 animate-pop-in">
        {/* View Counter */}
        <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-xl shadow-inner">
          <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-sm font-semibold">{viewCount}</span>
        </div>

        {/* Like Button */}
        <button
          onClick={handleLikeClick}
          disabled={isLiking || !isAuthenticated}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 ease-in-out min-w-[60px] justify-center relative group ${
            isLiked ? "bg-white text-red-500 shadow-lg scale-105" : isAuthenticated ? "bg-white/20 text-white hover:bg-white/30 hover:scale-105" : "bg-white/10 text-white/70 cursor-not-allowed"
          } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
          title={!isAuthenticated ? "Please login to like posts" : ""}
        >
          {!isAuthenticated && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Login to like
            </div>
          )}

          {isLiking ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className={`w-5 h-5 transition-transform duration-200 ${isLiked ? "scale-110" : "scale-100"}`} fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-semibold">{likeCount}</span>
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes pop-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          70% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-pop-in {
          animation: pop-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BlogPostView;
