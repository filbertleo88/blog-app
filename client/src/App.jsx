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
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Load user from localStorage - FIXED
  useEffect(() => {
    const initializeUser = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUserData = localStorage.getItem("user");

        if (storedToken && storedUserData) {
          try {
            const parsedUser = JSON.parse(storedUserData);
            setUser(parsedUser);
          } catch (error) {
            console.error("❌ Error parsing user data:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        } else {
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

  // Handle OAuth callback on ALL pages - FIXED
  useEffect(() => {
    const handleOAuthCallback = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");
      const userDataString = searchParams.get("user");
      const authStatus = searchParams.get("auth");

      console.log("🔍 OAuth callback check:", {
        token: !!token,
        userData: !!userDataString,
        authStatus,
        fullUrl: window.location.href,
      });

      if (authStatus === "success" && token && userDataString) {
        try {
          let userData;
          try {
            userData = JSON.parse(decodeURIComponent(userDataString));
          } catch (e) {
            userData = JSON.parse(userDataString);
          }

          console.log("✅ OAuth user data:", userData);

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userData));

          setUser(userData);

          toast.success(`Welcome back, ${userData.name}! 🎉`);

          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        } catch (error) {
          console.error("❌ Error processing OAuth callback:", error);
          toast.error("Authentication failed: " + error.message);
          window.history.replaceState({}, document.title, "/");
        }
      }
    };

    handleOAuthCallback();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
    toast.success(`Welcome to Inkspire, ${userData.name}! 🎉`);
  };

  const handleFormSubmit = async (postData) => {
    try {
      const token = localStorage.getItem("token");

      if (!token || !user) {
        toast.error("Please log in to create a post");
        return;
      }

      const postWithAuthor = {
        ...postData,
        author: {
          _id: user.id || user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      };

      const response = await fetch(`${API_BASE_URL}/blogposts`, {
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

      const refreshResponse = await fetch(`${API_BASE_URL}/blogposts`);
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
    console.log("Logging out...");
    console.log("User before logout:", user);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("blog_visitorId");
    localStorage.removeItem("likedPosts");

    setUser(null);

    console.log("User after logout:", user); // Should be null

    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    toast.success("Profile updated successfully!");
  };

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
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <div className="relative">
                  <BlogLandingPage user={user} posts={posts} />
                </div>
              }
            />
            <Route
              path="/register"
              element={
                <div className="relative">
                  <BlogLandingPage user={user} posts={posts} />
                </div>
              }
            />

            {/* Blog Routes */}
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
        <PostModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormSubmit} currentUser={user} />
        <AuthModal isVisible={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} initialView="login" />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
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
      </AuthProvider>
    </div>
  );
};

export default App;
