import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BlogPostCard from "./BlogPostCard";
import BlogLayout from "../../../components/Layouts/BlogLayout/BlogLayout";

const SearchPosts = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!query.trim()) {
          setPosts([]);
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5009/api/blogposts/search?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch search results: ${response.status}`);
        }

        const data = await response.json();

        // ✅ Only include published posts
        const publishedPosts = data.filter((post) => post.status === "published");

        setPosts(publishedPosts);
      } catch (error) {
        setError(error.message);
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [query]);

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
            <h2 className="text-red-800 font-semibold mb-2">Search Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Search Results {query && `for "${query}"`}</h1>
        <p className="text-gray-600 mb-8">{posts.length > 0 ? `Found ${posts.length} published post${posts.length !== 1 ? "s" : ""}` : query ? "No published posts found for your search query" : "Enter a search term to find posts"}</p>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post._id || post.id} post={post} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No published posts found for "{query}"</p>
            <p className="text-gray-400">Try different keywords or browse all posts.</p>
          </div>
        ) : null}
      </div>
    </BlogLayout>
  );
};

export default SearchPosts;
