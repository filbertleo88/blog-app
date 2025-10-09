import React, { useState, useEffect } from 'react';
import BlogPostCard from './BlogPostCard';
import BlogLayout from '../../../components/Layouts/BlogLayout/BlogLayout';

const BlogLandingPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/posts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <BlogLayout><p>Loading...</p></BlogLayout>;
  }

  if (error) {
    return <BlogLayout><p>Error: {error}</p></BlogLayout>;
  }

  return (
    <BlogLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Latest Blog Posts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post._id} post={post} />
        ))}
      </div>
    </BlogLayout>
  );
};

export default BlogLandingPage;
