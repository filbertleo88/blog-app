// components/Layouts/DashboardLayout/DashboardLayout.jsx
import React, {useState, useEffect} from "react";
import BlogNavbar from "./BlogNavbar";
import DashboardSidebar from "../../../pages/Admin/components/DashboardSidebar";

const DashboardLayout = ({ children, user, onLoginClick, onLogout, posts, activeNav, onNavChange, onProfileUpdate }) => {
  // Make sure you're properly handling user state
  const [currentUser, setCurrentUser] = useState(user);

  // Sync with prop changes
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    if (onProfileUpdate) {
      onProfileUpdate(updatedUser);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogNavbar onLoginClick={onLoginClick} user={user} onLogout={onLogout} posts={posts} />

      <div className="flex">
        {/* Sidebar (fixed) */}
        <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-md pt-20">
          {/* pt-20 = height offset for Navbar */}
          <DashboardSidebar activeNav={activeNav} onNavChange={onNavChange} user={user} onProfileUpdate={onProfileUpdate} />
        </div>

        {/* Main Content (adds margin-left same as sidebar width) */}
        <div className="flex-1 min-h-screen ml-64">
          <div className="p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
