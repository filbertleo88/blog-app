// components/pages/Admin/components/BlogPosts/BlogPosts.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostModal from "../../../components/PostModal"; // Import the PostModal component

const BlogPosts = () => {
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("blog-posts");
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(userData));

    // Load blog posts from localStorage or use mock data
    const savedPosts = localStorage.getItem("blogPosts");
    if (savedPosts) {
      setBlogPosts(JSON.parse(savedPosts));
    } else {
      // Initial mock data
      const initialPosts = [
        {
          id: 1,
          title: "Optimizing React Performance: Code Splitting, Memoization, and Lazy Loading",
          status: "published",
          updatedAt: "27th May 2025",
          views: 375,
          likes: 56,
          tags: ["React", "Performance", "Optimization", "Code Splitting"],
          thumbnail: "bg-gradient-to-br from-blue-400 to-purple-500",
          description: "Learn how to optimize your React applications with advanced techniques.",
          content: "Full content here...",
          author: { name: "Admin" },
          image: "https://source.unsplash.com/800x400/?react",
        },
        {
          id: 2,
          title: "Building a Serverless API with Next.js API Routes and Node.js",
          status: "published",
          updatedAt: "25th May 2025",
          views: 252,
          likes: 37,
          tags: ["Next.js", "API", "Serverless", "Node.js"],
          thumbnail: "bg-gradient-to-br from-green-400 to-blue-500",
          description: "Create serverless APIs using Next.js API routes.",
          content: "Full content here...",
          author: { name: "Admin" },
          image: "https://source.unsplash.com/800x400/?nextjs",
        },
        {
          id: 3,
          title: "Building a Simple CRUD App with React, Node.js, and Express",
          status: "published",
          updatedAt: "20th May 2025",
          views: 42,
          likes: 33,
          tags: ["React", "Node.js", "Express", "CRUD", "Beginner"],
          thumbnail: "bg-gradient-to-br from-orange-400 to-pink-500",
          description: "Step-by-step guide to building a CRUD application.",
          content: "Full content here...",
          author: { name: "Admin" },
          image: "https://source.unsplash.com/800x400/?coding",
        },
        {
          id: 4,
          title: "Advanced State Management with React Context and useReducer",
          status: "draft",
          updatedAt: "26th May 2025",
          views: 0,
          likes: 0,
          tags: ["React", "State Management", "Context API", "useReducer"],
          thumbnail: "bg-gradient-to-br from-purple-400 to-pink-500",
          description: "Master advanced state management in React.",
          content: "Full content here...",
          author: { name: "Admin" },
          image: "https://source.unsplash.com/800x400/?javascript",
        },
      ];
      setBlogPosts(initialPosts);
      localStorage.setItem("blogPosts", JSON.stringify(initialPosts));
    }
  }, [navigate]);

  const tabs = [
    { id: "all", label: "All", count: blogPosts.length },
    { id: "published", label: "Published", count: blogPosts.filter((post) => post.status === "published").length },
    { id: "draft", label: "Draft", count: blogPosts.filter((post) => post.status === "draft").length },
  ];

  const filteredPosts = activeTab === "all" ? blogPosts : blogPosts.filter((post) => post.status === activeTab);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (blogPosts.length > 0) {
      localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
    }
  }, [blogPosts]);

  const handleCreatePost = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleEditPost = (postId) => {
    const postToEdit = blogPosts.find((post) => post.id === postId);
    if (postToEdit) {
      setEditingPost(postToEdit);
      setIsModalOpen(true);
    }
  };

  const handleViewPost = (postId) => {
    console.log("Viewing post:", postId);
    // Navigate to the published post
    navigate(`/post/${postId}`);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const updatedPosts = blogPosts.filter((post) => post.id !== postId);
      setBlogPosts(updatedPosts);
    }
  };

  const handlePublishPost = (postId) => {
    const updatedPosts = blogPosts.map((post) => (post.id === postId ? { ...post, status: "published" } : post));
    setBlogPosts(updatedPosts);
  };

  const handleUnpublishPost = (postId) => {
    const updatedPosts = blogPosts.map((post) => (post.id === postId ? { ...post, status: "draft" } : post));
    setBlogPosts(updatedPosts);
  };

  const handleModalSubmit = async (postData) => {
    try {
      if (editingPost) {
        // Update existing post
        const updatedPosts = blogPosts.map((post) =>
          post.id === editingPost.id
            ? {
                ...post,
                ...postData,
                updatedAt: new Date()
                  .toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                  .replace(/(\d+)/, (match) => {
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
              }
            : post
        );
        setBlogPosts(updatedPosts);
      } else {
        // Create new post
        const newPost = {
          id: Date.now(), // Generate unique ID
          title: postData.title,
          description: postData.description,
          content: postData.content || "",
          tags: postData.tags || [],
          author: postData.author,
          image: postData.image || "https://source.unsplash.com/800x400/?blog",
          status: "draft", // Default to draft
          updatedAt: new Date()
            .toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
            .replace(/(\d+)/, (match) => {
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
          views: 0,
          likes: 0,
          thumbnail: "bg-gradient-to-br from-gray-400 to-gray-600", // Default thumbnail
        };
        setBlogPosts((prev) => [newPost, ...prev]);
      }

      setIsModalOpen(false);
      setEditingPost(null);
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post. Please try again.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingPost(null);
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

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Blog Posts</h1>
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
            <div key={post.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className={`w-20 h-20 rounded-2xl ${post.thumbnail} flex-shrink-0 flex items-center justify-center text-white text-2xl`}>
                  {post.image ? <img src={post.image} alt={post.title} className="w-full h-full object-cover rounded-2xl" /> : "📝"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">{post.title}</h3>

                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className="text-sm text-gray-600">Updated: {post.updatedAt}</span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-sm text-gray-600">👁️ {post.views}</span>
                          <span className="flex items-center gap-1 text-sm text-gray-600">💙 {post.likes}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                            {post.status === "published" ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      {/* Edit Button */}
                      <button onClick={() => handleEditPost(post.id)} className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      {/* View Button - Only show for published posts */}
                      {post.status === "published" && (
                        <button onClick={() => handleViewPost(post.id)} className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors text-sm font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="hidden sm:inline">View</span>
                        </button>
                      )}

                      {/* Publish/Unpublish Button */}
                      {post.status === "draft" ? (
                        <button onClick={() => handlePublishPost(post.id)} className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors text-sm font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="hidden sm:inline">Publish</span>
                        </button>
                      ) : (
                        <button onClick={() => handleUnpublishPost(post.id)} className="flex items-center gap-2 px-3 py-2 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-100 transition-colors text-sm font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="hidden sm:inline">Unpublish</span>
                        </button>
                      )}

                      {/* Delete Button */}
                      <button onClick={() => handleDeletePost(post.id)} className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium">
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
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">{activeTab === "draft" ? "You don't have any draft posts yet." : activeTab === "published" ? "You don't have any published posts yet." : "You don't have any posts yet."}</p>
            <button onClick={handleCreatePost} className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium">
              Create Your First Post
            </button>
          </div>
        )}
      </div>

      {/* Post Modal */}
      <PostModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleModalSubmit} initialData={editingPost} />
    </>
  );
};

export default BlogPosts;
