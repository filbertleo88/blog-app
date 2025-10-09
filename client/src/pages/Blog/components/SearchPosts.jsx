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
        const response = await fetch(`http://localhost:5009/api/blogposts?q=${query}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchPosts();
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <BlogLayout>
        <p>Loading...</p>
      </BlogLayout>
    );
  }

  if (error) {
    return (
      <BlogLayout>
        <p>Error: {error}</p>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Search Results for "{query}"</h1>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts found for your query.</p>
      )}
    </BlogLayout>
  );
};

export default SearchPosts;
