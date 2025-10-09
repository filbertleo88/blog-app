import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { posts } from '../../../data/posts';
import BlogPostCard from './BlogPostCard';
import BlogLayout from '../../../components/Layouts/BlogLayout/BlogLayout';

const SearchPosts = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const filteredPosts = posts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(query.toLowerCase());
    const descriptionMatch = post.description.toLowerCase().includes(query.toLowerCase());
    return titleMatch || descriptionMatch;
  });

  return (
    <BlogLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Search Results for "{query}"</h1>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No posts found matching your search.</p>
      )}
    </BlogLayout>
  );
};

export default SearchPosts;
