import React from "react";
import { Link } from "react-router-dom";

const BlogPostCard = ({ post }) => {
  const postId = post._id || post.id;

  // Generate image URL - use post.image if available, otherwise fallback
  const imageUrl = post.image || `https://source.unsplash.com/400x200/?${post.tags?.[0] || "tech"}`;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-lg transition flex flex-col h-full">
      <Link to={`/blogposts/${postId}`} className="flex flex-col flex-grow">
        <img className="w-full h-48 object-cover flex-shrink-0" src={imageUrl} alt={post.title} />
        <div className="p-6 flex flex-col flex-grow">
          <h2 className="font-semibold text-xl text-gray-800 hover:text-sky-600 mb-3 cursor-pointer line-clamp-2 min-h-[3.5rem]">{post.title}</h2>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-grow">{post.description}</p>
        </div>
      </Link>
      <div className="p-6 pt-0 mt-auto">
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags?.map((tag, index) => (
            <Link to={`/tag/${tag}`} key={index} className="text-xs bg-sky-100 text-sky-600 px-2 py-1 rounded-full hover:bg-sky-200 transition inline-block">
              #{tag}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          <img src={post.author?.avatar || "https://i.pravatar.cc/50"} alt={post.author?.name} className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-gray-700 font-medium truncate">{post.author?.name || "Unknown Author"}</p>
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">{post.date}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
