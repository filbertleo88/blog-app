// components/pages/Admin/components/BlogPosts/BlogPosts.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostModal from "../../../components/PostModal";

const BlogPosts = () => {
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("blog-posts");
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // API base URL
  const API_BASE = "http://localhost:5009/api";

  // Fetch ONLY current user's blog posts from backend
  const fetchMyBlogPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("user"));

      if (!token || !currentUser) {
        throw new Error("No authentication token or user data found");
      }

      // Fetch all posts and filter by author_id on frontend
      const response = await fetch(`${API_BASE}/blogposts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
          return;
        }
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const allPosts = await response.json();

      // Filter posts to only show those owned by the current user
      const myPosts = allPosts.filter((post) => post.author_id === currentUser.id);

      setBlogPosts(myPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setError(error.message);
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

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Fetch only user's posts from backend
    fetchMyBlogPosts();
  }, [navigate]);

  const tabs = [
    { id: "all", label: "All", count: blogPosts.length },
    { id: "published", label: "Published", count: blogPosts.filter((post) => post.status === "published").length },
    { id: "draft", label: "Draft", count: blogPosts.filter((post) => post.status === "draft").length },
  ];

  const filteredPosts = activeTab === "all" ? blogPosts : blogPosts.filter((post) => post.status === activeTab);

  const handleCreatePost = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleEditPost = (postId) => {
    const postToEdit = blogPosts.find((post) => post._id === postId);
    if (postToEdit) {
      setEditingPost(postToEdit);
      setIsModalOpen(true);
    }
  };

  const handleViewPost = (postId) => {
    navigate(`/blogposts/${postId}`);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/blogposts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.status}`);
      }

      // Remove from local state
      setBlogPosts((prev) => prev.filter((post) => post._id !== postId));
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(`Failed to delete post: ${error.message}`);
    }
  };

  const handlePublishPost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("user"));

      // First verify the post belongs to the current user
      const postToPublish = blogPosts.find((post) => post._id === postId);
      if (!postToPublish || postToPublish.author_id !== currentUser.id) {
        alert("You can only publish your own posts");
        return;
      }

      const response = await fetch(`${API_BASE}/blogposts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "published" }),
      });

      if (!response.ok) {
        throw new Error(`Failed to publish post: ${response.status}`);
      }

      // Update local state
      setBlogPosts((prev) => prev.map((post) => (post._id === postId ? { ...post, status: "published" } : post)));

      alert("Post published successfully!");
    } catch (error) {
      console.error("Error publishing post:", error);
      alert(`Failed to publish post: ${error.message}`);
    }
  };

  const handleUnpublishPost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("user"));

      // First verify the post belongs to the current user
      const postToUnpublish = blogPosts.find((post) => post._id === postId);
      if (!postToUnpublish || postToUnpublish.author_id !== currentUser.id) {
        alert("You can only unpublish your own posts");
        return;
      }

      const response = await fetch(`${API_BASE}/blogposts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "draft" }),
      });

      if (!response.ok) {
        throw new Error(`Failed to unpublish post: ${response.status}`);
      }

      // Update local state
      setBlogPosts((prev) => prev.map((post) => (post._id === postId ? { ...post, status: "draft" } : post)));

      alert("Post unpublished successfully!");
    } catch (error) {
      console.error("Error unpublishing post:", error);
      alert(`Failed to unpublish post: ${error.message}`);
    }
  };

  const handleModalSubmit = async (postData) => {
    try {
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("user"));

      // Prepare request data with only author_id
      const requestData = {
        title: postData.title,
        description: postData.description,
        content: postData.content || "",
        image: postData.image || "",
        tags: postData.tags || [],
        status: postData.status || "draft",
        author_id: currentUser.id, // Only send author_id
      };

      let response;

      if (editingPost) {
        // Verify the post being edited belongs to the current user
        if (editingPost.author_id !== currentUser.id) {
          alert("You can only edit your own posts");
          return;
        }

        // Update existing post
        response = await fetch(`${API_BASE}/blogposts/${editingPost._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });
      } else {
        // Create new post
        response = await fetch(`${API_BASE}/blogposts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const savedPost = await response.json();

      // Update local state
      if (editingPost) {
        setBlogPosts((prev) => prev.map((post) => (post._id === editingPost._id ? savedPost : post)));
      } else {
        setBlogPosts((prev) => [savedPost, ...prev]);
      }

      setIsModalOpen(false);
      setEditingPost(null);
      alert(editingPost ? "Post updated successfully!" : "Post created successfully!");
    } catch (error) {
      console.error("Error saving post:", error);
      alert(`Failed to save post: ${error.message}`);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();

    const getOrdinal = (d) => {
      if (d > 3 && d < 21) return d + "th";
      switch (d % 10) {
        case 1:
          return d + "st";
        case 2:
          return d + "nd";
        case 3:
          return d + "rd";
        default:
          return d + "th";
      }
    };

    return `${getOrdinal(day)} ${month} ${year}`;
  };

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading your posts</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchMyBlogPosts} className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Blog Posts</h1>
            <p className="text-gray-600">Manage and create your blog posts</p>
          </div>
          <button onClick={handleCreatePost} className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium mt-4 sm:mt-0 flex items-center gap-2">
            <span>+</span>
            <span>Create Post</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-2 mb-8 border border-gray-100 inline-flex">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 relative ${activeTab === tab.id ? "text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
              {tab.label} ({tab.count}){activeTab === tab.id && <span className="absolute bottom-2 left-6 right-6 h-0.5 bg-sky-500 rounded-full"></span>}
            </button>
          ))}
        </div>

        {/* Blog Posts List */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Post Image */}
                <div className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center text-white text-2xl">📝</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">{post.title}</h3>

                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className="text-sm text-gray-600">Updated: {formatDate(post.updatedAt || post.createdAt)}</span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-sm text-gray-600">👁️ {post.views || 0}</span>
                          <span className="flex items-center gap-1 text-sm text-gray-600">💙 {post.likes || 0}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                            {post.status === "published" ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {post.tags &&
                          post.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors">
                              #{tag}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 w-full max-w-[200px]">
                      {/* First Row */}
                      <div className="flex gap-2 col-span-2">
                        {/* Edit Button */}
                        <button onClick={() => handleEditPost(post._id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        {/* View Button - Only for published posts */}
                        {post.status === "published" && (
                          <button onClick={() => handleViewPost(post._id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="hidden sm:inline">View</span>
                          </button>
                        )}
                      </div>

                      {/* Second Row */}
                      <div className="flex gap-2 col-span-2">
                        {/* Publish/Unpublish Button */}
                        {post.status === "draft" ? (
                          <button
                            onClick={() => handlePublishPost(post._id)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="hidden sm:inline">Publish</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnpublishPost(post._id)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-100 transition-colors text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="hidden sm:inline">Unpublish</span>
                          </button>
                        )}

                        {/* Delete Button */}
                        <button onClick={() => handleDeletePost(post._id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "draft" ? "You don't have any draft posts yet." : activeTab === "published" ? "You don't have any published posts yet." : "You don't have any posts yet. Create your first post to get started!"}
            </p>
            <button onClick={handleCreatePost} className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium">
              Create Your First Post
            </button>
          </div>
        )}
      </div>

      {/* Post Modal */}
      <PostModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleModalSubmit} initialData={editingPost} currentUser={user} />
    </>
  );
};

export default BlogPosts;
