import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import BlogLandingPage from "./pages/Blog/components/BlogLandingPage";
import BlogPostView from "./pages/Blog/components/BlogPostView";
import PostByTags from "./pages/Blog/components/PostByTags";
import SearchPosts from "./pages/Blog/components/SearchPosts";
import AdminLogin from "./pages/Admin/components/AdminLogin";
import Dashboard from "./pages/Admin/components/Dashboard";
import BlogPosts from "./pages/Admin/components/BlogPosts";
import BlogPostEditor from "./pages/Admin/components/BlogPostEditor";
import Comments from "./pages/Admin/components/Comments";
import PrivateRoute from "./routes/PrivateRoute";
import FloatingButton from "./components/FloatingButton";
import PostModal from "./components/PostModal";
import AuthModal from "./components/Auth/AuthModal";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // In App.jsx - update the handleFormSubmit function
  // In your App.jsx - update the handleFormSubmit function
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
        // Get the error message from the backend
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Post created successfully:", data);

      // If fetchPosts is defined in App.jsx, call it to refresh the posts
      // If not, you can reload the page or use another method to refresh data
      window.location.reload(); // Simple solution - reload the page
      // OR: if you have a state update function, call it here

      return data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error; // Re-throw to be caught by PostModal
    }
  };

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    console.log("User authenticated:", userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div>
      <Router>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<BlogLandingPage />} />
          <Route path="/blogposts/:id" element={<BlogPostView />} />
          <Route path="/tag/:tag" element={<PostByTags />} />
          <Route path="/search" element={<SearchPosts />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/posts" element={<BlogPosts />} />
            <Route path="/admin/create" element={<BlogPostEditor />} />
            <Route path="/admin/edit/:postSlug" element={<BlogPostEditor isEdit={true} />} />
            <Route path="/admin/comments" element={<Comments />} />
          </Route>

          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </Router>

      <FloatingButton onClick={handleOpenModal} />
      <PostModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormSubmit} />

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
      {/* Login button example */}
      {!user ? (
        <button onClick={() => setIsAuthModalOpen(true)}>Login / Sign Up</button>
      ) : (
        <div>
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      <AuthModal isVisible={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />
    </div>
  );
};

export default App;
