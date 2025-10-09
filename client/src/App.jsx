import React, { useState } from "react";

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

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleFormSubmit = async (postData) => {
    try {
      const response = await fetch("http://localhost:5009/api/blogposts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const newPost = await response.json();
      toast.success("Post created successfully!");
      handleCloseModal();
      // Optionally, you can redirect to the new post or update the post list
    } catch (error) {
      toast.error("Failed to create post.");
    }
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
    </div>
  );
};

export default App;
