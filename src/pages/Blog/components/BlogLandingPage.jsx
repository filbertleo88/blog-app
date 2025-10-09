import React from 'react';
import BlogLayout from '../../../components/Layouts/BlogLayout/BlogLayout';
import BlogPostCard from './BlogPostCard';

const posts = [
  {
    id: 1,
    title: 'The Ultimate Guide to React Hooks',
    description: 'A deep dive into React Hooks, covering everything from useState to custom hooks. Learn how to write cleaner, more reusable React components.',
    tags: ['React', 'JavaScript', 'WebDev'],
    author: { name: 'John Doe' },
    date: 'Oct 8, 2025',
  },
    {
    id: 2,
    title: 'Getting Started with Next.js',
    description: 'A beginner-friendly guide to Next.js. Learn the basics of server-side rendering, routing, and data fetching in Next.js applications.',
    tags: ['NextJS', 'React', 'SSR'],
    author: { name: 'Jane Smith' },
    date: 'Oct 12, 2025',
  },
    {
    id: 3,
    title: 'Tailwind CSS for Modern Web Design',
    description: 'Discover the power of utility-first CSS with Tailwind CSS. This tutorial will show you how to build beautiful, responsive designs with ease.',
    tags: ['TailwindCSS', 'CSS', 'Design'],
    author: { name: 'Samuel Green' },
    date: 'Oct 15, 2025',
  },
];

const BlogLandingPage = () => {

  return (
    <BlogLayout activeMenu="Home">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
      <button className="mx-auto mt-8 block bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition">
        Load More
      </button>
    </BlogLayout>
  );
};

export default BlogLandingPage;
