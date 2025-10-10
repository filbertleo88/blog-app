import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardSidebar = ({ activeNav, onNavChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = {
    name: "Mike",
    email: "mike@timetoprogram.com",
    avatar: "https://i.pravatar.cc/150?img=2",
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/profile" },
    { id: "blog-posts", label: "Blog Posts", icon: "📝", path: "/blog-posts" },
    { id: "comments", label: "Comments", icon: "💬", path: "/comments" },
    { id: "logout", label: "Logout", icon: "🚪", action: "logout" },
  ];

  const handleNavigation = (item) => {
    if (item.action === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
      window.location.reload();
    } else {
      onNavChange(item.id);
      if (item.path) {
        navigate(item.path);
      }
    }
  };

  const getActiveNav = () => {
    const currentPath = location.pathname;
    const navItem = navigationItems.find((item) => item.path === currentPath);
    return navItem ? navItem.id : "dashboard";
  };

  const currentActiveNav = activeNav || getActiveNav();

  return (
    <div className="w-64 bg-white rounded-r-2xl shadow-sm border-r border-gray-100 fixed h-full z-40 lg:relative lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
      <div className="p-6 h-full flex flex-col">
        {/* Centered Avatar Profile */}
        <div className="flex flex-col items-center text-center mb-8 pt-8">
          <img src={user.avatar} alt="Profile" className="w-20 h-20 rounded-full border-4 border-white shadow-lg mb-4" />
          <div className="mb-2">
            <div className="text-lg font-semibold text-gray-800">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
          </div>
        </div>

        {/* Navigation - Sticky */}
        <nav className="space-y-3 flex-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                currentActiveNav === item.id ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg" : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
