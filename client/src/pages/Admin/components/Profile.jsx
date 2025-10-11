// components/pages/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostModal from "../../../components/PostModal";
import PostDetailsModal from "./PostDetailsModal";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    published: 0,
    drafts: 0,
    totalViews: 0,
    totalLikes: 0,
    avgViews: 0,
  });
  const [topPosts, setTopPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const navigate = useNavigate();

  const API_BASE = "http://localhost:5009/api";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!userData || !token) {
          navigate("/");
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Fetch user's posts from backend
        await fetchUserPosts(parsedUser.id, token);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/");
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchUserPosts = async (userId, token) => {
    try {
      setLoading(true);

      // Fetch all posts and filter by author
      const response = await fetch(`${API_BASE}/blogposts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const allPosts = await response.json();

      // Filter posts by current user (author)
      const userPosts = Array.isArray(allPosts) ? allPosts.filter((post) => post.author?._id === userId || post.author?.id === userId || post.author_id === userId) : [];

      console.log("User posts:", userPosts);
      setUserPosts(userPosts);

      // Calculate statistics
      calculateStats(userPosts);
      calculateTopPosts(userPosts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (posts) => {
    const totalPosts = posts.length;
    const published = posts.filter((post) => post.status === "published").length;
    const drafts = posts.filter((post) => post.status === "draft").length;
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
    const avgViews = totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0;

    setStats({
      totalPosts,
      published,
      drafts,
      totalViews,
      totalLikes,
      avgViews,
    });
  };

  const calculateTopPosts = (posts) => {
    // Sort posts by views (descending) and take top 3
    const sortedByViews = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

    setTopPosts(sortedByViews);
  };

  // Extract unique tags from user's posts
  const getUserTags = () => {
    const allTags = userPosts.flatMap((post) => post.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.slice(0, 15);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setShowCreateModal(true);
  };

  const handleEditPost = async (post, postData) => {
    try {
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("user"));

      const requestData = {
        title: postData.title,
        description: postData.description,
        content: postData.content || "",
        image: postData.image || "",
        tags: postData.tags || [],
        status: postData.status || "draft",
        author_id: currentUser.id,
      };

      const response = await fetch(`${API_BASE}/blogposts/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const updatedPost = await response.json();

      // Update local state
      setUserPosts((prev) => prev.map((p) => (p._id === post._id ? updatedPost : p)));

      alert("Post updated successfully!");
      fetchUserPosts(currentUser.id, token); // Refresh data
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  const handleCreatePostSubmit = async (postData) => {
    try {
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("user"));

      const requestData = {
        title: postData.title,
        description: postData.description,
        content: postData.content || "",
        image: postData.image || "",
        tags: postData.tags || [],
        status: postData.status || "draft",
        author_id: currentUser.id,
      };

      const response = await fetch(`${API_BASE}/blogposts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const newPost = await response.json();

      // Update local state
      setUserPosts((prev) => [newPost, ...prev]);

      setShowCreateModal(false);
      alert("Post created successfully!");
      fetchUserPosts(currentUser.id, token); // Refresh data
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    }
  };

  const handleViewOnSite = (post) => {
    if (post.status === "published") {
      window.open(`/blogposts/${post._id}`, "_blank");
    } else {
      alert("This post is still a draft and not publicly available.");
    }
  };

  const handleManagePosts = () => {
    navigate("/blog-posts");
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

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Jakarta",
  });

  // Get greeting based on WIB time
  const getGreeting = () => {
    const currentHour = new Date().getHours(); // This will use the system time

    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 15) {
      return "Good Afternoon";
    } else if (currentHour >= 15 && currentHour < 18) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  const greeting = getGreeting();

  const maxViews = topPosts.length > 0 ? Math.max(...topPosts.map((post) => post.views || 0)) : 1;

  // Enhanced Post Card Component
  const PostCard = ({ post, index, showRank = false }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group" onClick={() => handlePostClick(post)}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {showRank && <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">#{index + 1}</div>}
              <h3 className="font-semibold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{post.title}</h3>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.description}</p>
          </div>
          {post.image && <img src={post.image} alt={post.title} className="w-16 h-16 rounded-lg object-cover ml-4 flex-shrink-0 group-hover:scale-105 transition-transform duration-300" />}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
              {getStatusIcon(post.status)} {post.status}
            </span>
            <span className="flex items-center gap-1">👁️ {(post.views || 0).toLocaleString()}</span>
            <span className="flex items-center gap-1">💙 {(post.likes || 0).toLocaleString()}</span>
          </div>
          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
          <button onClick={() => navigate("/")} className="mt-4 bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-colors">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 lg:ml-0 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {greeting}! {user.name}
              </h1>
              <p className="text-gray-600 text-lg">{currentDate}</p>
              <p className="text-gray-500 text-sm mt-1">Welcome to your dashboard. Here's your writing journey so far.</p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button onClick={handleManagePosts} className="bg-gradient-to-r from-rose-500 to-amber-400 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium mt-4 sm:mt-0 flex items-center gap-2">
                Manage Posts
              </button>
              <button onClick={handleCreatePost} className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium mt-4 sm:mt-0 flex items-center gap-2">
                + Create Post
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Total Posts",
                value: stats.totalPosts,
                icon: "📝",
                description: "All your blog posts",
                color: "from-blue-500 to-cyan-500",
              },
              {
                label: "Published",
                value: stats.published,
                icon: "✅",
                description: "Publicly available posts",
                color: "from-green-500 to-emerald-500",
              },
              {
                label: "Total Views",
                value: stats.totalViews,
                icon: "📊",
                description: "Total views across all posts",
                color: "from-purple-500 to-pink-500",
              },
              {
                label: "Total Likes",
                value: stats.totalLikes,
                icon: "💙",
                description: "Total likes received",
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

        {/* Bottom Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tag Insights Panel */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Your Topics</h2>
            <div className="flex items-center space-x-6">
              {/* Enhanced Donut Chart Container - Made Bigger */}
              <div className="relative w-70 h-70 flex-shrink-0">
                <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                  {/* Background Circle */}
                  <circle cx="21" cy="21" r="15.9155" className="fill-none stroke-gray-200" strokeWidth="3"></circle>

                  {/* Calculate tag frequencies */}
                  {(() => {
                    // Count tag frequencies
                    const tagCounts = {};
                    userPosts.forEach((post) => {
                      (post.tags || []).forEach((tag) => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                      });
                    });

                    // Sort tags by frequency and get top 5
                    const sortedTags = Object.entries(tagCounts)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5);

                    const totalTags = Object.values(tagCounts).reduce((sum, count) => sum + count, 0);

                    // Calculate "Others" count
                    const othersCount = totalTags - sortedTags.reduce((sum, [, count]) => sum + count, 0);

                    // Create segments data including "Others"
                    const segments = sortedTags.map(([tag, count]) => ({
                      tag,
                      count,
                      percentage: (count / totalTags) * 100,
                    }));

                    if (othersCount > 0) {
                      segments.push({
                        tag: "Others",
                        count: othersCount,
                        percentage: (othersCount / totalTags) * 100,
                      });
                    }

                    const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];
                    const circumference = 2 * Math.PI * 15.9155;
                    let currentOffset = 0;

                    return segments.map((segment, index) => {
                      const segmentLength = (segment.percentage / 100) * circumference;
                      const strokeDasharray = `${segmentLength} ${circumference - segmentLength}`;
                      const strokeDashoffset = -currentOffset;
                      const color = colors[index % colors.length];

                      currentOffset += segmentLength;

                      return <circle key={segment.tag} cx="21" cy="21" r="15.9155" className="fill-none" strokeWidth="3" stroke={color} strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />;
                    });
                  })()}

                  {/* Center text with percentage */}
                  <text x="21" y="19" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-gray-700 transform rotate-90">
                    {getUserTags().length}
                  </text>
                  <text x="21" y="23" textAnchor="middle" dominantBaseline="central" className="text-[8px] fill-gray-500 transform rotate-90">
                    Tags
                  </text>
                </svg>
              </div>

              {/* Enhanced Tags list with counts */}
              <div className="flex-1 grid grid-cols-1 gap-3 max-h-100 overflow-y-auto">
                {(() => {
                  // Count tag frequencies
                  const tagCounts = {};
                  userPosts.forEach((post) => {
                    (post.tags || []).forEach((tag) => {
                      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    });
                  });

                  // Sort tags by frequency and get top 5
                  const sortedTags = Object.entries(tagCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5);

                  const totalTags = Object.values(tagCounts).reduce((sum, count) => sum + count, 0);

                  // Calculate "Others" count
                  const othersCount = totalTags - sortedTags.reduce((sum, [, count]) => sum + count, 0);

                  const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

                  return (
                    <>
                      {sortedTags.map(([tag, count], index) => {
                        const percentage = ((count / totalTags) * 100).toFixed(1);
                        return (
                          <div key={tag} className="flex items-center justify-between group">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors[index % colors.length] }}></div>
                              <span className="text-sm font-medium text-gray-700">#{tag}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{percentage}%</span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full min-w-8 text-center">{count}</span>
                            </div>
                          </div>
                        );
                      })}

                      {othersCount > 0 && (
                        <div className="flex items-center justify-between group pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors[5] }}></div>
                            <span className="text-sm font-medium text-gray-700">Others</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{((othersCount / totalTags) * 100).toFixed(1)}%</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full min-w-8 text-center">{othersCount}</span>
                          </div>
                        </div>
                      )}

                      {Object.keys(tagCounts).length === 0 && <p className="text-gray-500 text-sm col-span-2">No tags yet. Start writing to see your topics here!</p>}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Top Posts Panel */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Your Top Posts</h2>
              <span className="text-sm text-gray-500">
                {topPosts.length} of {stats.totalPosts} posts
              </span>
            </div>

            {topPosts.length > 0 ? (
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div key={post._id || index} className="space-y-3 p-4 hover:bg-gray-50 rounded-lg transition-all duration-200 cursor-pointer group border border-transparent hover:border-blue-200" onClick={() => handlePostClick(post)}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight flex-1 pr-4 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                      <div className="text-right text-xs text-gray-600 whitespace-nowrap">
                        <div>{(post.views || 0).toLocaleString()} views</div>
                        <div className="flex items-center gap-1">
                          <span>💙</span>
                          <span>{post.likes || 0} likes</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-sky-400 to-cyan-500 h-2 rounded-full transition-all duration-500 group-hover:from-purple-400 group-hover:to-pink-500"
                        style={{
                          width: `${((post.views || 0) / maxViews) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-gray-500 mb-2">No posts yet</p>
                <p className="text-sm text-gray-400">Start writing your first blog post to see it here!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Posts Section */}
        {userPosts.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Your Recent Posts</h2>
              <span className="text-sm text-gray-500">
                Showing {Math.min(userPosts.length, 4)} of {userPosts.length} posts
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userPosts.slice(0, 4).map((post, index) => (
                <PostCard key={post._id || index} post={post} index={index} />
              ))}
            </div>
            {userPosts.length > 4 && (
              <div className="text-center mt-6">
                <button onClick={handleManagePosts} className="text-blue-500 hover:text-blue-600 font-medium text-sm">
                  View All Posts →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Details Modal */}
      <PostDetailsModal post={selectedPost} isOpen={showPostModal} onClose={() => setShowPostModal(false)} onEdit={handleEditPost} onViewOnSite={handleViewOnSite} />

      {/* Create Post Modal */}
      <PostModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={handleCreatePostSubmit} initialData={editingPost} currentUser={user} />
    </>
  );
};

export default Profile;
