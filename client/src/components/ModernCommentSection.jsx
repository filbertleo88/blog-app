import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaReply } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import AuthModal from "./Auth/AuthModal";

const Comment = ({ comment, onAddReply, level = 0, isAuthenticated, onAuthRequired }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleAddReply = () => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    if (replyText.trim()) {
      onAddReply(comment._id, replyText);
      setReplyText("");
      setIsReplying(false);
    }
  };

  const handleToggleReplying = () => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    const newIsReplying = !isReplying;
    setIsReplying(newIsReplying);
    if (newIsReplying) {
      setShowReplies(false);
    }
  };

  const handleToggleShowReplies = () => {
    const newShowReplies = !showReplies;
    setShowReplies(newShowReplies);
    if (newShowReplies) {
      setIsReplying(false);
    }
  };

  return (
    <div className={`transition-colors duration-300 mb-3 p-4 rounded-xl shadow-sm hover:bg-gray-50 ${level > 0 ? "ml-8" : ""}`}>
      <div className="flex items-start space-x-4">
        <img src={comment.avatar} alt={`${comment.user}'s avatar`} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900">{comment.user}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
          </div>
          <p className="text-gray-700 mt-1">{comment.text}</p>
          <div className="flex items-center justify-between mt-4 text-sm">
            {level < 2 && (
              <button
                onClick={handleToggleReplying}
                className={`flex items-center space-x-2 transition-colors duration-200 ${isAuthenticated ? "text-gray-500 hover:text-gray-900" : "text-gray-300 cursor-not-allowed"}`}
                title={!isAuthenticated ? "Please login to reply" : ""}
              >
                <FaReply />
                <span>Reply</span>
              </button>
            )}
            {comment.replies && comment.replies.length > 0 && (
              <button onClick={handleToggleShowReplies} className="bg-sky-100 text-sky-700 font-medium py-1 px-3 rounded-full hover:bg-sky-200 transition-colors duration-200 flex items-center">
                {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                <IoMdArrowDropdown className={`ml-1 transition-transform duration-300 ${showReplies ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isReplying && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 ml-16">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-400 focus:border-blue-400 transition"
              rows="2"
              placeholder="Add a reply..."
            ></textarea>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setIsReplying(false)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm">
                Cancel
              </button>
              <button onClick={handleAddReply} className="px-4 py-1 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-lg hover:opacity-90 transition text-sm flex items-center gap-2">
                <FaReply />
                Reply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReplies && comment.replies && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 space-y-4 pt-4 border-t border-gray-200">
            {comment.replies.map((reply) => (
              <Comment key={reply._id} comment={reply} onAddReply={onAddReply} level={level + 1} isAuthenticated={isAuthenticated} onAuthRequired={onAuthRequired} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ModernCommentSection = ({ onCommentAction, isAuthenticated, onAuthRequired }) => {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Get current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
    }
  }, []);

  // Handle authentication requirement
  const handleAuthRequired = () => {
    setIsAuthModalOpen(true);
  };

  // Handle successful authentication
  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthModalOpen(false);
    // You can add any post-authentication logic here
  };

  // Fetch comments from database
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5009/api/comments/post/${postId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        const data = await response.json();
        setComments(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleAddReply = async (parentId, text) => {
    if (!isAuthenticated) {
      handleAuthRequired();
      return;
    }

    if (text.trim() === "") return;

    try {
      const userData = currentUser || { name: "Unknown User", avatar: "https://i.pravatar.cc/50" };

      const response = await fetch("http://localhost:5009/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          user: userData.name || userData.username || "@CurrentUser",
          text,
          parentId,
          avatar: userData.avatar || userData.profilePicture || "https://i.pravatar.cc/50",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add reply");
      }

      const newReply = await response.json();

      // Update local state to include the new reply
      const updateCommentsWithReply = (comments, parentId, newReply) => {
        return comments.map((comment) => {
          if (comment._id === parentId) {
            return {
              ...comment,
              replies: [newReply, ...(comment.replies || [])],
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentsWithReply(comment.replies, parentId, newReply),
            };
          }
          return comment;
        });
      };

      setComments((prevComments) => updateCommentsWithReply(prevComments, parentId, newReply));
    } catch (error) {
      console.error("Error adding reply:", error);
      setError("Failed to add reply");
    }
  };

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      handleAuthRequired();
      return;
    }

    if (newComment.trim() === "") return;

    try {
      const userData = currentUser || { name: "Unknown User", avatar: "https://i.pravatar.cc/50" };

      const response = await fetch("http://localhost:5009/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          user: userData.name || userData.username || "@CurrentUser",
          text: newComment,
          avatar: userData.avatar || userData.profilePicture || "https://i.pravatar.cc/50",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newCommentData = await response.json();
      setComments((prevComments) => [newCommentData, ...prevComments]);
      setNewComment("");
      setIsCommentBoxOpen(false);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment");
    }
  };

  const handleOpenCommentBox = () => {
    if (!isAuthenticated) {
      handleAuthRequired();
      return;
    }
    setIsCommentBoxOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Comments {comments.length > 0 && `(${comments.length})`}</h2>
          <button
            onClick={handleOpenCommentBox}
            className={`font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 ${
              isAuthenticated ? "bg-gradient-to-r from-[#2193b0] to-[#6dd5ed] text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            title={!isAuthenticated ? "Please login to comment" : ""}
          >
            Add Comment
          </button>
        </div>

        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-yellow-800">
              Please{" "}
              <button onClick={handleAuthRequired} className="text-blue-600 hover:text-blue-800 underline font-medium">
                login
              </button>{" "}
              to comment on this post.
            </p>
          </div>
        )}

        <AnimatePresence>
          {isCommentBoxOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6">
              <div className="flex items-start space-x-3 mb-3">
                <img src={currentUser?.avatar || currentUser?.profilePicture || "https://i.pravatar.cc/50"} alt="Your avatar" className="w-8 h-8 rounded-full" />
                <span className="font-semibold text-gray-900">{currentUser?.name || currentUser?.username || "You"}</span>
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-400 focus:border-blue-400 transition resize-none"
                rows="4"
                placeholder="Write a comment..."
              ></textarea>
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => setIsCommentBoxOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm">
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className={`px-4 py-2 rounded-lg transition text-sm ${newComment.trim() ? "bg-sky-500 text-white hover:bg-sky-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                  Post Comment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => <Comment key={comment._id} comment={comment} onAddReply={handleAddReply} isAuthenticated={isAuthenticated} onAuthRequired={handleAuthRequired} />)
          ) : (
            <div className="text-center py-8 text-gray-500">{isAuthenticated ? "No comments yet. Be the first to comment!" : "No comments yet. Login to be the first to comment!"}</div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isVisible={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />
    </>
  );
};

export default ModernCommentSection;
