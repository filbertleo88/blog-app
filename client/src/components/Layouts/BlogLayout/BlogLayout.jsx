// In BlogLayout.jsx
import React, { useState, useEffect } from "react";
import BlogNavbar from "./BlogNavbar";
import AuthModal from "../../Auth/AuthModal";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import API_BASE_URL from "../../../config/api";

const BlogLayout = ({ children, activeMenu }) => {
  const [posts, setPosts] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Check if we're on a dashboard page
  const isDashboardPage = ["/profile", "/blog-posts", "/comments"].includes(location.pathname);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/blogposts`);
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
    console.log("Auth success - user data:", userData);
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogNavbar activeMenu={activeMenu} onLoginClick={handleLoginClick} posts={posts} user={user} />

      {/* Different layout for dashboard pages vs blog pages */}
      {isDashboardPage ? (
        // Dashboard layout with sidebar
        <div className="flex">
          {/* Dashboard pages will render their own sidebar and content */}
          {children}
        </div>
      ) : (
        // Regular blog layout
        <main className="container mx-auto py-8 px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">{children}</div>
            <div className="lg:w-1/3">
              <Sidebar />
            </div>
          </div>
        </main>
      )}

      <AuthModal isVisible={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />
    </div>
  );
};

export default BlogLayout;
