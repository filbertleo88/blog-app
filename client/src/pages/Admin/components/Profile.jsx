// components/pages/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Mock data
  const stats = {
    totalPosts: 12,
    published: 11,
    totalViews: 741,
    totalLikes: 209,
  };

  const topPosts = [
    { title: "Optimizing React Performance: Code Splitting, Memoization, and Lazy Loading", views: 375, likes: 56 },
    { title: "Building a Serverless API with Next.js API Routes and Node.js", views: 252, likes: 37 },
    { title: "Building a Simple CRUD App with React, Node.js, and Express", views: 42, likes: 33 },
  ];

  const maxViews = Math.max(...topPosts.map((post) => post.views));

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Good Morning! {user.name.split(" ")[0]}</h1>
          <p className="text-gray-600 text-lg">{currentDate}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Posts", value: stats.totalPosts, icon: "📝", color: "blue" },
            { label: "Published", value: stats.published, icon: "✅", color: "green" },
            { label: "Total Views", value: stats.totalViews, icon: "📊", color: "purple" },
            { label: "Total Likes", value: stats.totalLikes, icon: "💙", color: "pink" },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value.toLocaleString()}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tag Insights Panel */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Top Insights</h2>
            <div className="flex items-center space-x-6">
              <div className="relative w-32 h-32 flex-shrink-0">
                <div className="absolute inset-0 rounded-full border-8 border-blue-200"></div>
                <div className="absolute inset-2 rounded-full border-8 border-blue-500 transform -rotate-45"></div>
                <div className="absolute inset-4 rounded-full border-8 border-green-500 transform rotate-45"></div>
                <div className="absolute inset-6 rounded-full border-8 border-purple-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-700">Tags</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-3">
                {["#React", "#Next.js", "#Node.js", "#Optimization", "#Performance", "#API", "#Beginner", "#UI Components", "#SEO", "#UI", "#State Management", "#Static Site Generation", "#Routing", "#CRUD", "#SSR"].map((tag, index) => (
                  <span key={index} className="inline-flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Top Posts Panel */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Top Posts</h2>
            <div className="space-y-6">
              {topPosts.map((post, index) => (
                <div key={index} className="space-y-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight flex-1 pr-4">{post.title}</h3>
                    <div className="text-right text-xs text-gray-600 whitespace-nowrap">
                      <div>{post.views.toLocaleString()} views</div>
                      <div className="flex items-center gap-1">
                        <span>✔️</span>
                        <span>{post.likes} likes</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-sky-400 to-cyan-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(post.views / maxViews) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
