import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import BlogLandingPage from "./pages/Blog/components/BlogLandingPage";
import BlogPostView from "./pages/Blog/components/BlogPostView";
import PostByTags from "./pages/Blog/components/PostByTags";
import SearchPosts from "./pages/Blog/components/SearchPosts";
import FloatingButton from "./components/FloatingButton";
import PostModal from "./components/PostModal";
import AuthModal from "./components/Auth/AuthModal";
import Profile from "./pages/Admin/components/Profile";
import BlogPosts from "./pages/Admin/components/BlogPosts";
import Comments from "./pages/Admin/components/Comments";
import DashboardLayout from "./components/Layouts/BlogLayout/DashboardLayout";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeNav, setActiveNav] = useState("dashboard");

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Fetch posts for navbar tags
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
    fetchPosts();
  }, []);

  const handleFormSubmit = async (postData) => {
    try {
      console.log("Submitting post data:", postData);

      const response = await fetch("http://localhost:5009/api/blogposts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Post created successfully:", data);

      toast.success("Post created successfully!");
      window.location.reload();

      return data;
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
      throw error;
    }
  };

  // Check for OAuth callback on app load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userData = urlParams.get("user");
    const authStatus = urlParams.get("auth");

    if (authStatus === "success" && token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        toast.success(`Welcome, ${user.name}!`);
      } catch (error) {
        console.error("Error processing OAuth callback:", error);
        toast.error("Authentication failed");
      }
    }
  }, []);

  // Check for existing auth on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
    toast.success(`Welcome, ${userData.name}!`);
    console.log("User authenticated:", userData);
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  //   setUser(null);
  //   toast.success("Logged out successfully");
  // };

  // In your App.js - update handleLogout
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear blog-related data to prevent like state persistence
    localStorage.removeItem("blog_visitorId");
    localStorage.removeItem("likedPosts");

    setUser(null);
    toast.success("Logged out successfully");
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Default Route */}
          {/* Homepage Route - With FloatingButton */}
          <Route
            path="/"
            element={
              <div className="relative">
                <BlogLandingPage />
                {/* FloatingButton only on homepage when user is logged in */}
                {user && <FloatingButton onClick={handleOpenModal} />}
              </div>
            }
          />
          <Route path="/blogposts/:id" element={<BlogPostView />} />
          <Route
            path="/tag/:tag"
            element={
              <div className="relative">
                <PostByTags />
                {user && <FloatingButton onClick={handleOpenModal} />}
              </div>
            }
          />
          <Route
            path="/search"
            element={
              <div className="relative">
                <SearchPosts />
                {user && <FloatingButton onClick={handleOpenModal} />}
              </div>
            }
          />

          {/* Dashboard Routes with BlogLayout - No Floating Button */}
          <Route
            path="/profile"
            element={
              <DashboardLayout user={user} onLoginClick={handleLoginClick} onLogout={handleLogout} posts={posts} activeNav="dashboard" onNavChange={setActiveNav}>
                <Profile />
              </DashboardLayout>
            }
          />

          <Route
            path="/blog-posts"
            element={
              <DashboardLayout user={user} onLoginClick={handleLoginClick} onLogout={handleLogout} posts={posts} activeNav="blog-posts" onNavChange={setActiveNav}>
                <BlogPosts />
              </DashboardLayout>
            }
          />

          <Route
            path="/comments"
            element={
              <DashboardLayout user={user} onLoginClick={handleLoginClick} onLogout={handleLogout} posts={posts} activeNav="comments" onNavChange={setActiveNav}>
                <Comments />
              </DashboardLayout>
            }
          />
        </Routes>
      </Router>

      {/* Global Components */}
      <PostModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormSubmit} />

      <AuthModal isVisible={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />

      <Toaster
        position="top-right"
        toastOptions={{
          className: "",
          style: {
            fontSize: "14px",
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#10B981",
            },
          },
          error: {
            style: {
              background: "#EF4444",
            },
          },
        }}
      />
    </div>
  );
};

export default App;
