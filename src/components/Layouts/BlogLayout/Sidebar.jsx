import React from 'react';

const recentPosts = [
  {
    title: 'Advanced React Patterns',
    category: 'React',
    image: 'https://via.placeholder.com/150',
  },
  {
    title: 'State Management in Next.js',
    category: 'Next.js',
    image: 'https://via.placeholder.com/150',
  },
    {
    title: 'Utility-First CSS with Tailwind',
    category: 'CSS',
    image: 'https://via.placeholder.com/150',
  },
];

const Sidebar = () => {
  return (
    <aside className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
        Recent Posts
      </h2>
      <div>
        {recentPosts.map((post, index) => (
          <div key={index} className="flex items-center gap-3 mb-4">
            <img src={post.image} alt={post.title} className="w-16 h-16 object-cover rounded-md" />
            <div>
              <span className="text-xs text-sky-500 font-semibold uppercase">{post.category}</span>
              <p className="text-sm text-gray-700 hover:text-sky-500 transition cursor-pointer">{post.title}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;