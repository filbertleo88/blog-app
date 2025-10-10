import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BlogLayout from "../../../components/Layouts/BlogLayout/BlogLayout";
import ModernCommentSection from "../../../components/ModernCommentSection";

const BlogPostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5009/api/blogposts/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
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
    return (
      <BlogLayout>
        <div className="max-w-4xl mx-auto">
          <p>Loading...</p>
        </div>
      </BlogLayout>
    );
  }

  if (error) {
    return (
      <BlogLayout>
        <div className="max-w-4xl mx-auto">
          <p>Error: {error}</p>
        </div>
      </BlogLayout>
    );
  }

  if (!post) {
    return (
      <BlogLayout>
        <div className="max-w-4xl mx-auto">
          <p>Post not found.</p>
        </div>
      </BlogLayout>
    );
  }
  // <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Blog Post Header */}
        <article className="mb-12">
          {/* Blog Post Image */}
          {post.image && (
            <div className="mb-8">
              <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg shadow-md" />
            </div>
          )}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">{post.title}</h1>
          <div className="text-gray-600 mb-8">
            <span>By {post.author?.name || "Unknown Author"}</span>
            <span className="mx-2">•</span>
            <span>{post.date || new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="prose prose-lg max-w-none mb-8">{post.content || post.description}</div>
          <div className="mt-8">
            {post.tags?.map((tag) => (
              <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* Comments Section */}
        <section className="border-t border-gray-200 pt-8">
          <ModernCommentSection />
        </section>
      </div>
    </BlogLayout>
  );
};

export default BlogPostView;
