import React from 'react';
import { useParams } from 'react-router-dom';
import { posts } from '../../../data/posts';
import BlogPostCard from './BlogPostCard';
import BlogLayout from '../../../components/Layouts/BlogLayout/BlogLayout';

const PostByTags = () => {
  const { tag } = useParams();
  const filteredPosts = posts.filter((post) => post.tags.includes(tag));

  return (
    <BlogLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Posts tagged with "{tag}"</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </BlogLayout>
  );
};

export default PostByTags;
