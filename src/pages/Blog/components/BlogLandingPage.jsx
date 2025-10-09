import React, { useState } from 'react';
import BlogLayout from '../../../components/Layouts/BlogLayout/BlogLayout';
import BlogPostCard from './BlogPostCard';
import { posts } from '../../../data/posts';

const BlogLandingPage = () => {
  const [visiblePosts, setVisiblePosts] = useState(4);

  const handleLoadMore = () => {
    setVisiblePosts((prev) => prev + 4);
  };

  return (
    <BlogLayout activeMenu="Home">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.slice(0, visiblePosts).map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
      {visiblePosts < posts.length && (
        <button 
          onClick={handleLoadMore} 
          className="mx-auto mt-8 block bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition"
        >
          Load More
        </button>
      )}
    </BlogLayout>
  );
};

export default BlogLandingPage;
