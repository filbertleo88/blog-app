import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BlogPostCard from "./BlogPostCard";
import BlogLayout from "../../../components/Layouts/BlogLayout/BlogLayout";
import API_BASE_URL from "../../../config/api";

const PostByTags = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_BASE_URL}/blogposts/tags/${encodeURIComponent(tag)}`);

        // ✅ Only show published posts
        const publishedPosts = response.data.filter((post) => post.status === "published");

        setPosts(publishedPosts);
      } catch (error) {
        setError(error.response?.data?.message || error.message || "Failed to fetch posts");
        console.error("Error fetching posts by tag:", error);
      } finally {
        setLoading(false);
      }
    };

    if (tag) fetchPosts();
  }, [tag]);

  if (loading) {
    return (
      <BlogLayout>
        <div className="max-w-6xl mx-auto px-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </BlogLayout>
    );
  }

  if (error) {
    return (
      <BlogLayout>
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold mb-2">Error Loading Posts</h2>
            <p className="text-red-600">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
              Try Again
            </button>
          </div>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Posts Tagged with "{tag}"</h1>
          <p className="text-gray-600">
            Found {posts.length} published post
            {posts.length !== 1 ? "s" : ""} matching this tag
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post._id || post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No published posts found for "{tag}"</p>
            <p className="text-gray-400">Try browsing other tags or check back later.</p>
          </div>
        )}
      </div>
    </BlogLayout>
  );
};

export default PostByTags;
