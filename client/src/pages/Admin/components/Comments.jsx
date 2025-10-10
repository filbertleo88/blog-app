// components/pages/Admin/components/Comments/Comments.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Comments = () => {
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("comments");
  const [expandedReplies, setExpandedReplies] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  // Mock comments data - now in state so we can update it
  const initialComments = useMemo(
    () => [
      {
        id: 1,
        user: {
          name: "Mike",
          username: "@Mike",
          avatar: "https://i.pravatar.cc/150?img=2",
        },
        date: "19th May 2025",
        text: "Great Post",
        replies: [],
        post: {
          title: "Building a Serverless API with Next.js API Routes and Node.js",
          thumbnail: "bg-gradient-to-br from-blue-400 to-purple-500",
        },
      },
      {
        id: 2,
        user: {
          name: "Ben",
          username: "@Ben",
          avatar: "https://i.pravatar.cc/150?img=3",
        },
        date: "21st May 2025",
        text: "Nice Post",
        replies: [
          {
            id: 21,
            user: {
              name: "Mike",
              username: "@Mike",
              avatar: "https://i.pravatar.cc/150?img=2",
            },
            date: "22nd May 2025",
            text: "Thanks Ben!",
            replies: [],
          },
        ],
        post: {
          title: "Building a Simple CRUD App with React, Node.js, and Express",
          thumbnail: "bg-gradient-to-br from-green-400 to-blue-500",
        },
      },
      {
        id: 3,
        user: {
          name: "Emma",
          username: "@Emma",
          avatar: "https://i.pravatar.cc/150?img=4",
        },
        date: "22nd May 2025",
        text: "Great Tutorial! I was able to follow along and build my own basic app. Thanks!",
        replies: [
          {
            id: 31,
            user: {
              name: "Mike",
              username: "@Mike",
              avatar: "https://i.pravatar.cc/150?img=2",
            },
            date: "23rd May 2025",
            text: "Awesome to hear that Emma!",
            replies: [],
          },
        ],
        post: {
          title: "Building a Simple CRUD App with React, Node.js, and Express",
          thumbnail: "bg-gradient-to-br from-orange-400 to-pink-500",
        },
      },
      {
        id: 4,
        user: {
          name: "Olivia",
          username: "@Olivia",
          avatar: "https://i.pravatar.cc/150?img=5",
        },
        date: "22nd May 2025",
        text: "Super helpful!",
        replies: [
          {
            id: 41,
            user: {
              name: "Mike",
              username: "@Mike",
              avatar: "https://i.pravatar.cc/150?img=2",
            },
            date: "27th May 2025",
            text: "Thanks for the feedback, Olivia! Glad you found it helpful!",
            replies: [],
          },
        ],
        post: {
          title: "Mastering Server-Side Rendering (SSR) in Next.js for Improved SEO",
          thumbnail: "bg-gradient-to-br from-purple-400 to-pink-500",
        },
      },
      {
        id: 5,
        user: {
          name: "Lilly",
          username: "@Lilly",
          avatar: "https://i.pravatar.cc/150?img=6",
        },
        date: "22nd May 2025",
        text: "Could you explain how to add validation to the form inputs?",
        replies: [
          {
            id: 51,
            user: {
              name: "Mike",
              username: "@Mike",
              avatar: "https://i.pravatar.cc/150?img=2",
            },
            date: "23rd May 2025",
            text: "Sure! I'll create a follow-up post about form validation next week.",
            replies: [],
          },
        ],
        post: {
          title: "Building a Simple CRUD App with React, Node.js, and Express",
          thumbnail: "bg-gradient-to-br from-orange-400 to-pink-500",
        },
      },
    ],
    []
  );

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(userData));
    setComments(initialComments);
  }, [navigate, initialComments]);

  // Use useMemo for filtered comments
  const filteredComments = useMemo(() => {
    if (searchTerm) {
      return comments.filter(
        (comment) => comment.user.username.toLowerCase().includes(searchTerm.toLowerCase()) || comment.text.toLowerCase().includes(searchTerm.toLowerCase()) || comment.post.title.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      // Remove comment from state
      const updatedComments = comments.filter((comment) => comment.id !== commentId);
      setComments(updatedComments);
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

  const handleSubmitReply = (commentId) => {
    if (!replyText.trim()) {
      alert("Please enter a reply message");
      return;
    }

    // Generate a new reply ID (in a real app, this would come from the backend)
    const newReplyId = Date.now();

    // Create the new reply object
    const newReply = {
      id: newReplyId,
      user: {
        name: "Admin", // Assuming the current user is admin
        username: "@Admin",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      date: new Date()
        .toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
        .replace(/(\d+)/, (match) => {
          // Add ordinal suffix
          const day = parseInt(match);
          if (day > 3 && day < 21) return day + "th";
          switch (day % 10) {
            case 1:
              return day + "st";
            case 2:
              return day + "nd";
            case 3:
              return day + "rd";
            default:
              return day + "th";
          }
        }),
      text: replyText,
      replies: [],
    };

    // Update comments with the new reply
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        };
      }
      return comment;
    });

    setComments(updatedComments);
    setReplyingTo(null);
    setReplyText("");

    // Auto-expand replies for the commented post
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: true,
    }));

    // In a real application, you would send the reply to your backend here
    console.log("Reply submitted:", newReply);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const renderComment = (comment, level = 0, isReply = false) => (
    <div key={comment.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${level > 0 ? "ml-8 border-l-4 border-l-blue-100 bg-blue-50/30" : ""} ${isReply ? "mt-4" : ""}`}>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <img src={comment.user.avatar} alt={comment.user.name} className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
              </div>

              {/* Comment Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-bold text-gray-800 text-lg">{comment.user.username}</h4>
                    <span className="text-sm text-gray-500">• {comment.date}</span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4 text-base">{comment.text}</p>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="3"
                    />
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleSubmitReply(comment.id)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                        Submit Reply
                      </button>
                      <button onClick={handleCancelReply} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  {!isReply && (
                    <>
                      <button type="button" onClick={(e) => handleReply(comment.id, e)} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Reply
                      </button>

                      <button type="button" onClick={() => toggleReplies(comment.id)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                        <svg className={`w-4 h-4 transition-transform ${expandedReplies[comment.id] ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:text-white hover:bg-red-500 transition-colors text-sm font-medium ml-auto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Nested Replies */}
            {expandedReplies[comment.id] && comment.replies.length > 0 && <div className="mt-6 space-y-4">{comment.replies.map((reply) => renderComment(reply, level + 1, true))}</div>}
          </div>

          {/* Post Reference - Only show for top-level comments */}
          {!isReply && (
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl ${comment.post.thumbnail} flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md`}>📝</div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-3 mb-1">{comment.post.title}</h5>
                    <p className="text-xs text-gray-500">Related Post</p>
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

  return (
    <div className="flex-1 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Comments</h1>
            <p className="text-gray-600">Manage and moderate user comments</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Comments</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{comments.length}</p>
              </div>
              <div className="text-2xl text-blue-500">💬</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Replies</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{comments.reduce((acc, comment) => acc + comment.replies.length, 0)}</p>
              </div>
              <div className="text-2xl text-green-500">↩️</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Posts</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{new Set(comments.map((comment) => comment.post.title)).size}</p>
              </div>
              <div className="text-2xl text-purple-500">📝</div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">{filteredComments.map((comment) => renderComment(comment))}</div>

      {/* Empty State */}
      {filteredComments.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{searchTerm ? "No matching comments" : "No comments yet"}</h3>
          <p className="text-gray-600 mb-6">{searchTerm ? "Try adjusting your search terms" : "Comments from your blog posts will appear here."}</p>
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm("")} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
