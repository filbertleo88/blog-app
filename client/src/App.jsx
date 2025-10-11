// App.jsx
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
import BlogLayout from "./components/Layouts/BlogLayout/BlogLayout";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Load user from localStorage
  useEffect(() => {
    const initializeUser = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUserData = localStorage.getItem("user");

        console.log("🔄 Initializing user from localStorage:", {
          hasToken: !!storedToken,
          hasUserData: !!storedUserData,
        });

        if (storedToken && storedUserData) {
          try {
            const parsedUser = JSON.parse(storedUserData);
            console.log("✅ User loaded from localStorage:", parsedUser);
            setUser(parsedUser);
          } catch (error) {
            console.error("❌ Error parsing user data:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        } else {
          console.log("ℹ️ No user data in localStorage");
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Error initializing user:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Check for OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userData = urlParams.get("user");
    const authStatus = urlParams.get("auth");

    console.log("🔍 Checking OAuth callback:", {
      token: !!token,
      userData: !!userData,
      authStatus,
    });

    if (authStatus === "success" && token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        console.log("✅ OAuth user received:", user);

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        toast.success(`Welcome, ${user.name}! 🎉`);
      } catch (error) {
        console.error("❌ Error processing OAuth callback:", error);
        toast.error("Authentication failed");
      }
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    console.log("✅ Auth success callback, user data:", userData);
    setUser(userData);
    setIsAuthModalOpen(false);
    toast.success(`Welcome to Time To Program, ${userData.name}! 🎉`);
  };

  const handleFormSubmit = async (postData) => {
    try {
      console.log("Submitting post data:", postData);
      console.log("Current user:", user);

      const token = localStorage.getItem("token");

      if (!token || !user) {
        toast.error("Please log in to create a post");
        return;
      }

      const postWithAuthor = {
        ...postData,
        author: {
          _id: user.id, // Use user.id
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      };

      const response = await fetch("http://localhost:5009/api/blogposts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postWithAuthor),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast.success("Post created successfully!");
      handleCloseModal();

      // Refresh posts
      const refreshResponse = await fetch("http://localhost:5009/api/blogposts");
      if (refreshResponse.ok) {
        const refreshResult = await refreshResponse.json();
        const refreshedPosts = Array.isArray(refreshResult) ? refreshResult : refreshResult.data || refreshResult.posts || [];
        setPosts(refreshedPosts);
      }

      return data;
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.message || "Failed to create post");
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("blog_visitorId");
    localStorage.removeItem("likedPosts");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleProfileUpdate = (updatedUser) => {
    console.log("🔄 Profile updated:", updatedUser);
    setUser(updatedUser);
    toast.success("Profile updated successfully!");
  };

  // Debug user state
  useEffect(() => {
    console.log("🔄 Current user state:", user);
    console.log("🔄 User has id:", user?.id);
    console.log("🔄 Should show floating button:", user && user.id);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <BlogLayout user={user} posts={posts}>
                <div className="min-h-screen"></div>
              </BlogLayout>
            }
          />
          <Route
            path="/register"
            element={
              <BlogLayout user={user} posts={posts}>
                <div className="min-h-screen"></div>
              </BlogLayout>
            }
          />

          {/* Blog Routes with Floating Button */}
          <Route
            path="/"
            element={
              <div className="relative">
                <BlogLandingPage user={user} posts={posts} />
                {user && user.id && <FloatingButton onClick={handleOpenModal} />}
              </div>
            }
          />

          <Route
            path="/blogposts/:id"
            element={
              <div className="relative">
                <BlogPostView user={user} />
                {user && user.id && <FloatingButton onClick={handleOpenModal} />}
              </div>
            }
          />

          <Route
            path="/tag/:tag"
            element={
              <div className="relative">
                <PostByTags user={user} />
                {user && user.id && <FloatingButton onClick={handleOpenModal} />}
              </div>
            }
          />

          <Route
            path="/search"
            element={
              <div className="relative">
                <SearchPosts user={user} />
                {user && user.id && <FloatingButton onClick={handleOpenModal} />}
              </div>
            }
          />

          {/* Dashboard Routes */}
          <Route
            path="/profile"
            element={
              <DashboardLayout user={user} onLoginClick={handleLoginClick} onLogout={handleLogout} posts={posts} activeNav="dashboard" onNavChange={setActiveNav} onProfileUpdate={handleProfileUpdate}>
                <Profile user={user} onProfileUpdate={handleProfileUpdate} />
              </DashboardLayout>
            }
          />

          <Route
            path="/blog-posts"
            element={
              <DashboardLayout user={user} onLoginClick={handleLoginClick} onLogout={handleLogout} posts={posts} activeNav="blog-posts" onNavChange={setActiveNav} onProfileUpdate={handleProfileUpdate}>
                <BlogPosts user={user} />
              </DashboardLayout>
            }
          />

          <Route
            path="/comments"
            element={
              <DashboardLayout user={user} onLoginClick={handleLoginClick} onLogout={handleLogout} posts={posts} activeNav="comments" onNavChange={setActiveNav} onProfileUpdate={handleProfileUpdate}>
                <Comments user={user} />
              </DashboardLayout>
            }
          />
        </Routes>
      </Router>

      {/* Global Components */}
      <PostModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormSubmit} user={user} />

      <AuthModal isVisible={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} initialView="login" />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
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
            iconTheme: {
              primary: "#fff",
              secondary: "#10B981",
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
