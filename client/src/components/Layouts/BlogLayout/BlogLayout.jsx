// import React, { useState } from "react";
// import BlogNavbar from "./BlogNavbar";
// import Sidebar from "./Sidebar";
// import AuthModal from "../../Auth/AuthModal";

// const BlogLayout = ({ children, activeMenu }) => {
//   const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

//   return (
//     <div className="bg-white pb-20">
//       <BlogNavbar activeMenu={activeMenu} onLoginClick={() => setIsAuthModalVisible(true)} />
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-8 py-6">
//         {/* Main Content (Blog Feed) */}
//         <div className="lg:col-span-2">{children}</div>

//         {/* Sidebar */}
//         <div className="lg:col-span-1">
//           <Sidebar />
//         </div>
//       </div>

//       <AuthModal
//         isVisible={isAuthModalVisible}
//         onClose={() => setIsAuthModalVisible(false)}
//       />
//     </div>
//   );
// };

// export default BlogLayout;

// import React, { useState, useEffect } from "react";
// import BlogNavbar from "./BlogNavbar";
// import AuthModal from "../../Auth/AuthModal";
// import Sidebar from "./Sidebar"; // Make sure to import Sidebar

// const BlogLayout = ({ children, activeMenu }) => {
//   const [posts, setPosts] = useState([]);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [user, setUser] = useState(null);

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

//     // Check if user is logged in
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       setUser(JSON.parse(userData));
//     }

//     fetchPosts();
//   }, []);

//   const handleAuthSuccess = (userData) => {
//     setUser(userData);
//     setIsAuthModalOpen(false);
//   };

//   const handleLoginClick = () => {
//     setIsAuthModalOpen(true);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <BlogNavbar activeMenu={activeMenu} onLoginClick={handleLoginClick} posts={posts} />
//       <main className="container mx-auto py-8 px-4">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Main Content - takes 2/3 width on large screens */}
//           <div className="lg:w-2/3">{children}</div>

//           {/* Sidebar - takes 1/3 width on large screens */}
//           <div className="lg:w-1/3">
//             <Sidebar />
//           </div>
//         </div>
//       </main>

//       <AuthModal isVisible={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />
//     </div>
//   );
// };

// export default BlogLayout;

// In BlogLayout.jsx
import React, { useState, useEffect } from "react";
import BlogNavbar from "./BlogNavbar";
import AuthModal from "../../Auth/AuthModal";
import Sidebar from "./Sidebar";

const BlogLayout = ({ children, activeMenu }) => {
  const [posts, setPosts] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5009/api/blogposts");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    // Check if user is logged in on component mount
    const checkUserAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    };

    fetchPosts();
    checkUserAuth();
  }, []);

  const handleAuthSuccess = (userData) => {
    console.log("Auth success - user data:", userData); // Debug log
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogNavbar
        activeMenu={activeMenu}
        onLoginClick={handleLoginClick}
        posts={posts}
        user={user} // Pass user state to BlogNavbar
      />
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">{children}</div>
          <div className="lg:w-1/3">
            <Sidebar />
          </div>
        </div>
      </main>

      <AuthModal isVisible={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />
    </div>
  );
};

export default BlogLayout;
