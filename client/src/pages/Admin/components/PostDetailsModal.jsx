// components/pages/Profile/components/PostDetailsModal.jsx
import React, { useState, useEffect } from "react";
import PostModal from "../../../components/PostModal";
import MarkdownRenderer from "../../Blog/components/common/MarkdownRenderer";

const PostDetailsModal = ({ post, isOpen, onClose, onEdit, onViewOnSite }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !post) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "published":
        return "✅";
      case "draft":
        return "📝";
      default:
        return "❓";
    }
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleEditSubmit = (postData) => {
    onEdit(post, postData);
    setShowEditModal(false);
    onClose();
  };

  const handleEditClose = () => {
    setShowEditModal(false);
  };

  // Close modal when clicking on the background
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={handleBackdropClick}>
        {/* Blurry Backdrop */}
        <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-all duration-300"></div>

        {/* Modal Content */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 relative z-10">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">Post Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            {post.image && <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-lg mb-4" />}

            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(post.status)}`}>
                {getStatusIcon(post.status)} {post.status?.charAt(0).toUpperCase() + post.status?.slice(1)}
              </span>
              <span className="text-sm text-gray-500">Created: {formatDate(post.createdAt)}</span>
              {post.updatedAt !== post.createdAt && <span className="text-sm text-gray-500">Updated: {formatDate(post.updatedAt)}</span>}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">{post.title}</h2>
            
            <MarkdownRenderer content={post.content} className="text-gray-600 mb-4" />

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{post.views || 0}</div>
                <div className="text-gray-600">Views</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{post.likes || 0}</div>
                <div className="text-gray-600">Likes</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center p-6 border-t border-gray-200">
            {/* View on Site / Preview Button */}
            <button onClick={() => onViewOnSite(post)} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{post.status === "published" ? "View on Site" : "Preview"}</span>
            </button>

            <div className="flex gap-2">
              {/* Edit Post Button */}
              <button onClick={handleEditClick} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Post</span>
              </button>

              {/* Close Button */}
              <button onClick={onClose} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Post Modal */}
      <PostModal isOpen={showEditModal} onClose={handleEditClose} onSubmit={handleEditSubmit} initialData={post} currentUser={JSON.parse(localStorage.getItem("user"))} />
    </>
  );
};

export default PostDetailsModal;
