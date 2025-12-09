// App.jsx - Updated to handle Google OAuth on homepage
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useSearchParams } from "react-router-dom";
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
import API_BASE_URL from "./config/api";

// Wrapper component to handle Google OAuth
const HomePageWithAuth = ({ user, posts, handleOpenModal }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const googleAuth = searchParams.get("google_auth");
      const sessionId = searchParams.get("session");

      if (googleAuth === "success" && sessionId && !isProcessing) {
        setIsProcessing(true);
        console.log("🔍 Processing Google Auth session:", sessionId);

        try {
          // Show loading toast
          const loadingToast = toast.loading("Completing sign in...");

          // Fetch session data from backend
          const response = await fetch(`${API_BASE_URL}/auth/google-session?session=${sessionId}`);

          if (!response.ok) {
            throw new Error("Failed to retrieve session");
          }

          const data = await response.json();

          if (data.success) {
            // Store token and user data
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Dismiss loading toast
            toast.dismiss(loadingToast);
            toast.success(`Welcome back, ${data.user.name}! 🎉`);

            // Clean up URL
            setSearchParams({});

            // Reload to update app state
            window.location.href = "/";
          } else {
            throw new Error(data.message || "Authentication failed");
          }
        } catch (error) {
          console.error("❌ Google auth error:", error);
          toast.error("Sign in failed: " + error.message);
          setSearchParams({});
        } finally {
          setIsProcessing(false);
        }
      } else if (googleAuth === "failed") {
        toast.error("Google sign in failed. Please try again.");
        setSearchParams({});
      }
    };

    handleGoogleAuth();
  }, [searchParams, setSearchParams, isProcessing]);

  // Add this useEffect in your App component (outside the Routes)
  useEffect(() => {
    const handleAuthCallback = () => {
      const pathname = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);

      if (pathname === "/auth/callback") {
        const token = searchParams.get("token");
        const userDataString = searchParams.get("user");

        if (token && userDataString) {
          try {
            const userData = JSON.parse(decodeURIComponent(userDataString));

            // Store in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", userDataString);
            setUser(userData);

            toast.success(`Welcome back, ${userData.name}! 🎉`);

            // Clear URL and redirect to home
            window.history.replaceState({}, "", "/");
            window.location.href = "/";
          } catch (error) {
            console.error("Error processing auth callback:", error);
            toast.error("Authentication failed");
            window.location.href = "/login";
          }
        }
      }
    };

    handleAuthCallback();
  }, []);

  // Add this useEffect at the TOP of your App component
  useEffect(() => {
    // Handle /auth/callback immediately
    if (window.location.pathname === "/auth/callback") {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");
      const userDataString = searchParams.get("user");

      if (token && userDataString) {
        try {
          const userData = JSON.parse(decodeURIComponent(userDataString));
          localStorage.setItem("token", token);
          localStorage.setItem("user", userDataString);
          setUser(userData);
          toast.success(`Welcome back, ${userData.name}!`);

          // Redirect to home
          window.history.replaceState({}, "", "/");
          window.location.href = "/";
        } catch (error) {
          console.error("Auth callback error:", error);
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }
  }, []);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-cyan-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Completing sign in...</h2>
          <p className="text-gray-600 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <BlogLandingPage user={user} posts={posts} />
      {user && user.id && <FloatingButton onClick={handleOpenModal} />}
    </div>
  );
};

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

      // Refresh posts
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
            {/* Home page with Google Auth handler */}
            <Route path="/" element={<HomePageWithAuth user={user} posts={posts} handleOpenModal={handleOpenModal} />} />
            // In your App.jsx, add this route in the Routes section:
            <Route
              path="/auth/callback"
              element={
                <BlogLayout user={user} posts={posts}>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Processing authentication...</p>
                    </div>
                  </div>
                </BlogLayout>
              }
            />
            {/* Blog Routes */}
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
