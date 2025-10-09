import React, { useState } from "react";
import BlogNavbar from "./BlogNavbar";
import Sidebar from "./Sidebar";
import AuthModal from "../../Auth/AuthModal";

const BlogLayout = ({ children, activeMenu }) => {
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

  return (
    <div className="bg-white pb-20">
      <BlogNavbar activeMenu={activeMenu} onLoginClick={() => setIsAuthModalVisible(true)} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-8 py-6">
        {/* Main Content (Blog Feed) */}
        <div className="lg:col-span-2">{children}</div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>

      <AuthModal
        isVisible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
      />
    </div>
  );
};

export default BlogLayout;

// // In your BlogLayout.jsx or wherever you use BlogNavbar
// import React, { useState, useEffect } from "react";
// import BlogNavbar from "./BlogNavbar";

// const BlogLayout = ({ children, activeMenu }) => {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await fetch("http://localhost:5009/api/blogposts");
//         if (response.ok) {
//           const data = await response.json();
//           setPosts(data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch posts:", error);
//       }
//     };
//     fetchPosts();
//   }, []);

//   const handleLoginClick = () => {
//     // Your login logic
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <BlogNavbar
//         activeMenu={activeMenu}
//         onLoginClick={handleLoginClick}
//         posts={posts} // Pass posts as prop to avoid duplicate fetching
//       />
//       <main className="container mx-auto py-8 px-4">{children}</main>
//     </div>
//   );
// };

// export default BlogLayout;
