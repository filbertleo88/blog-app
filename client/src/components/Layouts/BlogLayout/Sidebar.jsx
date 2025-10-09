import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5009/api/blogposts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const postsData = await response.json();

        // Sort by date descending and take top 5
        const top5Posts = postsData.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)).slice(0, 5);

        setRecentPosts(top5Posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <aside className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Recent Posts</h2>
        <p>Loading...</p>
      </aside>
    );
  }

  return (
    <aside className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Recent Posts</h2>
      <div>
        {recentPosts.map((post) => (
          <Link to={`/blogposts/${post._id || post.id}`} key={post._id || post.id} className="group block">
            <div className="flex items-start gap-4 mb-4">
              <img src={`https://source.unsplash.com/150x150/?${post.tags?.[0] || "tech"}`} alt={post.title} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-sky-500 transition line-clamp-2">{post.title}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.description?.substring(0, 55) || "No description available"}...</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
