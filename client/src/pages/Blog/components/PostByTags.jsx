import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BlogPostCard from './BlogPostCard';
import BlogLayout from '../../../components/Layouts/BlogLayout/BlogLayout';

const PostByTags = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/posts/tag/${tag}`);
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
  }, [tag]);

  if (loading) {
    return <BlogLayout><p>Loading...</p></BlogLayout>;
  }

  if (error) {
    return <BlogLayout><p>Error: {error}</p></BlogLayout>;
  }

  return (
    <BlogLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Posts Tagged with "{tag}"</h1>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts found for this tag.</p>
      )}
    </BlogLayout>
  );
};

export default PostByTags;
