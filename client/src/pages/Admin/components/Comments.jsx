// components/pages/Admin/components/Comments/Comments.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import PostDetailsModal from "./PostDetailsModal"; // Adjust the import path as needed
import MarkdownRenderer from "../../Blog/components/common/MarkdownRenderer";

const Comments = () => {
  const [user, setUser] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const navigate = useNavigate();

  // Fetch comments from backend - only from author's own posts
  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("user"));

      if (!currentUser || !token) {
        navigate("/");
        return;
      }

      // Fetch only the current user's posts
      const response = await fetch("http://localhost:5009/api/blogposts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }

      const allPosts = await response.json();

      // Filter posts by current user (author)
      const userPosts = Array.isArray(allPosts) ? allPosts.filter((post) => post.author?._id === currentUser.id || post.author?.id === currentUser.id || post.author_id === currentUser.id) : [];

      console.log("User's posts:", userPosts);

      // Fetch comments for each of the user's posts
      const allComments = [];
      for (const post of userPosts) {
        try {
          const commentsResponse = await fetch(`http://localhost:5009/api/comments/post/${post._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (commentsResponse.ok) {
            const postComments = await commentsResponse.json();
            // Add post information to each comment
            const commentsWithPostInfo = postComments.map((comment) => ({
              ...comment,
              post: {
                _id: post._id,
                title: post.title,
                description: post.description ,
                image: post.image || "https://source.unsplash.com/random/800x400/?blog",
                tags: post.tags || [],
                createdAt: post.createdAt,
                status: post.status || "published",
                views: post.views || 0,
                likes: post.likes || 0,
                content: post.content || "",
              },
            }));
            allComments.push(...commentsWithPostInfo);
          }
        } catch (error) {
          console.error(`Error fetching comments for post ${post._id}:`, error);
        }
      }

      setComments(allComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(userData));
    fetchComments();
  }, [navigate]);

  // Use useMemo for filtered comments
  const filteredComments = useMemo(() => {
    if (searchTerm) {
      return comments.filter(
        (comment) => comment.user.toLowerCase().includes(searchTerm.toLowerCase()) || comment.text.toLowerCase().includes(searchTerm.toLowerCase()) || (comment.post && comment.post.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return comments;
  }, [searchTerm, comments]);

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5009/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      // Remove comment from state
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));

      // Show success message
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText("");
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) {
      toast.warning("Please enter comment text");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5009/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editText }),
      });

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      const updatedComment = await response.json();

      // Update comments state
      setComments((prev) => prev.map((comment) => (comment._id === commentId ? updatedComment : comment)));

      setEditingComment(null);
      setEditText("");
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  };

  const handleReply = (commentId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setReplyingTo(commentId);
    setReplyText("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleSubmitReply = async (commentId) => {
    if (!replyText.trim()) {
      toast.warning("Please enter a reply message");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("user"));

      // Find the parent comment to get postId
      const parentComment = comments.find((comment) => comment._id === commentId);
      if (!parentComment) {
        throw new Error("Parent comment not found");
      }

      const replyData = {
        postId: parentComment.postId || parentComment.post._id,
        user: currentUser.name || "Admin",
        text: replyText,
        avatar: currentUser.avatar || "",
        parentId: commentId,
      };

      const response = await fetch("http://localhost:5009/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(replyData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit reply");
      }

      const newReply = await response.json();

      // Update comments state with the new reply
      setComments((prev) => prev.map((comment) => (comment._id === commentId ? { ...comment, replies: [...(comment.replies || []), newReply] } : comment)));

      setReplyingTo(null);
      setReplyText("");

      // Auto-expand replies for the commented post
      setExpandedReplies((prev) => ({
        ...prev,
        [commentId]: true,
      }));

      toast.success("Reply submitted successfully");
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Failed to submit reply");
    }
  };

  const handleViewPost = (post) => {
    setViewingPost(post);
    setShowPostModal(true);
  };

  const handleViewOnSite = (post) => {
    if (post.status === "published") {
      window.open(`/blogposts/${post._id}`, "_blank");
    } else {
      toast.info("This post is still a draft and not publicly available.");
    }
  };

  const handleEditPost = (post) => {
    // Navigate to edit post page or open edit modal
    console.log("Edit post:", post);
    toast.info(`Edit post: ${post.title}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();

    // Add ordinal suffix
    const getOrdinalSuffix = (n) => {
      if (n > 3 && n < 21) return "th";
      switch (n % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  const renderComment = (comment, level = 0, isReply = false) => (
    <div
      key={comment._id}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 
        transform hover:-translate-y-0.5
        ${level > 0 ? "ml-8 border-l-4 border-l-blue-100 bg-blue-50/30" : ""} 
        ${isReply ? "mt-4" : ""}
      `}
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <img src={comment.avatar || null} alt={comment.user} className="w-12 h-12 rounded-full border-2 border-white shadow-md hover:scale-105 transition-transform duration-200" />
              </div>

              {/* Comment Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-bold text-gray-800 text-lg hover:text-blue-600 transition-colors cursor-pointer">@{comment.user}</h4>
                    <span className="text-sm text-gray-500" title={formatDate(comment.createdAt)}>
                      {getTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Edit Mode */}
                {editingComment === comment._id ? (
                  <div className="mb-4">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="3"
                    />
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleUpdateComment(comment._id)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                        Save
                      </button>
                      <button onClick={handleCancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 leading-relaxed mb-4 text-base bg-gray-50 p-3 rounded-lg border border-gray-200">{comment.text}</p>

                    {/* Reply Form */}
                    {replyingTo === comment._id && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply here..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows="3"
                        />
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => handleSubmitReply(comment._id)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                            Submit Reply
                          </button>
                          <button onClick={handleCancelReply} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Action Buttons */}
                {editingComment !== comment._id && (
                  <div className="flex items-center gap-3 flex-wrap">
                    {!isReply && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handleReply(comment._id, e)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          Reply
                        </button>

                        {comment.replies && comment.replies.length > 0 && (
                          <button type="button" onClick={() => toggleReplies(comment._id)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                            <svg className={`w-4 h-4 transition-transform ${expandedReplies[comment._id] ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                          </button>
                        )}
                      </>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                      <button type="button" onClick={() => handleEditComment(comment)} className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:text-white hover:bg-red-500 transition-colors text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Nested Replies */}
            {expandedReplies[comment._id] && comment.replies && comment.replies.length > 0 && <div className="mt-6 space-y-4">{comment.replies.map((reply) => renderComment(reply, level + 1, true))}</div>}
          </div>

          {/* Post Reference - Only show for top-level comments */}
          {!isReply && comment.post && (
            <div className="lg:w-80 flex-shrink-0">
              <div
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => handleViewPost(comment.post)}
              >
                <div className="flex items-start gap-3">
                  {comment.post.image && <img src={comment.post.image} alt={comment.post.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-200" />}
                  <div className="min-w-0 flex-1">
                    <h5 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">{comment.post.title}</h5>
                    <MarkdownRenderer content={comment.post.content} className="text-xs text-gray-500 line-clamp-2 mb-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600 font-medium">View Post</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading comments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Comments</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchComments} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Comments</h1>
            <p className="text-gray-600">Manage comments on your blog posts</p>
          </div>

          {/* Search Bar */}
          <div className="lg:w-80">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[
            {
              label: "Total Comments",
              value: comments.length,
              icon: "💬",
              description: "All comments on your posts",
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Total Replies",
              value: comments.reduce((acc, comment) => acc + (comment.replies ? comment.replies.length : 0), 0),
              icon: "↩️",
              description: "Replies to comments",
              color: "from-green-500 to-emerald-500",
            },
            {
              label: "Your Posts",
              value: new Set(comments.filter((c) => c.post).map((c) => c.post.title)).size,
              icon: "📝",
              description: "Your posts with comments",
              color: "from-purple-500 to-pink-500",
            },
            {
              label: "Today",
              value: comments.filter((c) => {
                const commentDate = new Date(c.createdAt).toDateString();
                const today = new Date().toDateString();
                return commentDate === today;
              }).length,
              icon: "🕒",
              description: "Comments today",
              color: "from-red-500 to-orange-500",
            },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center text-white text-xl`}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">{filteredComments.map((comment) => renderComment(comment))}</div>

      {/* Empty State */}
      {filteredComments.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{searchTerm ? "No matching comments" : "No comments yet"}</h3>
          <p className="text-gray-600 mb-6">{searchTerm ? "Try adjusting your search terms" : "Comments on your blog posts will appear here."}</p>
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm("")} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* PostDetailsModal */}
      <PostDetailsModal post={viewingPost} isOpen={showPostModal} onClose={() => setShowPostModal(false)} onEdit={handleEditPost} onViewOnSite={handleViewOnSite} />
    </div>
  );
};

export default Comments;
