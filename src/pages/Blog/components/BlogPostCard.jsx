import React from 'react';
import { Link } from 'react-router-dom';

const BlogPostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-lg transition">
      <Link to={`/post/${post.id}`}>
        <img className="w-full" src="https://via.placeholder.com/400x200" alt="Blog Post Image" />
        <div className="p-6">
          <h2 className="font-semibold text-xl text-gray-800 hover:text-sky-600 mb-2 cursor-pointer">{post.title}</h2>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{post.description}</p>
          <div className="mt-4">
            {post.tags.map((tag, index) => (
              <span key={index} className="text-xs bg-sky-100 text-sky-600 px-2 py-1 rounded-full mr-2">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <img src="/author.jpg" className="w-8 h-8 rounded-full" />
            <p className="text-sm text-gray-700 font-medium">{post.author.name}</p>
            <span className="text-xs text-gray-400">• {post.date}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogPostCard;
