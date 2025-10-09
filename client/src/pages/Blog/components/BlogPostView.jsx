import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BlogLayout from '../../../components/Layouts/BlogLayout/BlogLayout';

const BlogPostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/posts/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <BlogLayout><p>Loading...</p></BlogLayout>;
  }

  if (error) {
    return <BlogLayout><p>Error: {error}</p></BlogLayout>;
  }

  if (!post) {
    return <BlogLayout><p>Post not found.</p></BlogLayout>;
  }

  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
        <div className="text-gray-600 mb-8">
          <span>By {post.author}</span>
          <span className="mx-2">•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="prose prose-lg max-w-none">
          {post.content}
        </div>
        <div className="mt-8">
          {post.tags.map(tag => (
            <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#{tag}</span>
          ))}
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogPostView;
