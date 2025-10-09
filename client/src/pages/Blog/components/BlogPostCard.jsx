// import React from 'react';
// import { Link } from 'react-router-dom';

// const BlogPostCard = ({ post }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-lg transition">
//       <Link to={`/blogposts/${post.id}`}>
//         <img className="w-full" src="https://via.placeholder.com/400x200" alt="Blog Post Image" />
//         <div className="p-6">
//           <h2 className="font-semibold text-xl text-gray-800 hover:text-sky-600 mb-2 cursor-pointer">{post.title}</h2>
//           <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{post.description}</p>
//         </div>
//       </Link>
//       <div className="p-6 pt-0">
//         <div className="mt-4">
//           {post.tags.map((tag, index) => (
//             <Link to={`/tag/${tag}`} key={index} className="text-xs bg-sky-100 text-sky-600 px-2 py-1 rounded-full mr-2 hover:bg-sky-200 transition">
//               #{tag}
//             </Link>
//           ))}
//         </div>
//         <div className="flex items-center gap-2 mt-4">
//           <img src="/author.jpg" className="w-8 h-8 rounded-full" />
//           <p className="text-sm text-gray-700 font-medium">{post.author.name}</p>
//           <span className="text-xs text-gray-400">• {post.date}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogPostCard;

import React from "react";
import { Link } from "react-router-dom";

const BlogPostCard = ({ post }) => {
  // Use _id for MongoDB or id as fallback
  const postId = post._id || post.id;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-lg transition">
      <Link to={`/blogposts/${postId}`}>
        <img className="w-full h-48 object-cover" src={`https://source.unsplash.com/400x200/?${post.tags?.[0] || "tech"}`} alt={post.title} />
        <div className="p-6">
          <h2 className="font-semibold text-xl text-gray-800 hover:text-sky-600 mb-2 cursor-pointer">{post.title}</h2>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{post.description}</p>
        </div>
      </Link>
      <div className="p-6 pt-0">
        <div className="mt-4">
          {post.tags?.map((tag, index) => (
            <Link to={`/tag/${tag}`} key={index} className="text-xs bg-sky-100 text-sky-600 px-2 py-1 rounded-full mr-2 hover:bg-sky-200 transition">
              #{tag}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <img src={`https://source.unsplash.com/32x32/?portrait&${post.author?.name || "author"}`} alt={post.author?.name} className="w-8 h-8 rounded-full object-cover" />
          <p className="text-sm text-gray-700 font-medium">{post.author?.name || "Unknown Author"}</p>
          <span className="text-xs text-gray-400">• {post.date}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
