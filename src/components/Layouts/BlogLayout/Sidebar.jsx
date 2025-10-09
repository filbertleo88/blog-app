import React from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../../../data/posts';

// Sort posts by date in descending order and take the top 5
const recentPosts = posts
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5);

const Sidebar = () => {
  return (
    <aside className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
        Recent Posts
      </h2>
      <div>
        {recentPosts.map((post) => (
          <Link to={`/post/${post.id}`} key={post.id} className="group">
            <div className="flex items-start gap-4 mb-4">
              <img src={`https://source.unsplash.com/150x150/?${post.tags[0]}`} alt={post.title} className="w-16 h-16 object-cover rounded-lg" />
              <div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-sky-500 transition">{post.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {`${post.description.substring(0, 55)}...`}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
