// pages/Admin/components/DashboardSidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardSidebar = ({ activeNav, onNavChange, user, onProfileUpdate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [currentUser, setCurrentUser] = useState(user);

  // Sync the internal state with the user prop
  useEffect(() => {
    console.log("DashboardSidebar - User prop changed:", user);
    if (user) {
      setCurrentUser(user);
      setEditFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    } else {
      setCurrentUser(null);
      setEditFormData({
        name: "",
        email: "",
        avatar: "",
      });
    }
  }, [user]);

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

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditFormData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      avatar: currentUser?.avatar || "",
    });
  };

 // pages/Admin/components/DashboardSidebar.jsx - Updated handleSaveProfile
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      console.log("🔍 SAVE PROFILE - Token:", token ? "Exists" : "Missing");
      console.log("🔍 SAVE PROFILE - Stored user:", storedUser);

      if (!token) {
        alert("Please login again - no token found");
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
        return;
      }

      // Validate current user data
      if (!currentUser || !currentUser.id) {
        alert("User data is invalid. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
        return;
      }

      // Prepare update data
      const updateData = {
        name: editFormData.name.trim(),
        email: editFormData.email.trim(),
      };

      // Handle avatar
      if (editFormData.avatar && editFormData.avatar !== currentUser?.avatar) {
        updateData.avatar = editFormData.avatar;
      }

      console.log("🔍 SAVE PROFILE - Sending request with data:", updateData);

      const response = await fetch("http://localhost:5009/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      console.log("🔍 SAVE PROFILE - Response status:", response.status);

      const data = await response.json();
      console.log("🔍 SAVE PROFILE - Full response:", data);

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, clear localStorage and reload
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
          return;
        }
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || "Profile update failed");
      }

      // Success - update everything
      localStorage.setItem("user", JSON.stringify(data.user));
      setCurrentUser(data.user);

      if (onProfileUpdate) {
        onProfileUpdate(data.user);
      }

      setIsEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);

      if (error.message.includes("Failed to fetch")) {
        alert("Network error: Cannot connect to server. Please check if your backend is running.");
      } else if (error.message.includes("401")) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditFormData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      avatar: currentUser?.avatar || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditFormData((prev) => ({
          ...prev,
          avatar: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getActiveNav = () => {
    const currentPath = location.pathname;
    const navItem = navigationItems.find((item) => item.path === currentPath);
    return navItem ? navItem.id : "dashboard";
  };

  const currentActiveNav = activeNav || getActiveNav();

  // Function to get avatar display URL
  const getAvatarUrl = () => {
    if (currentUser?.avatar) {
      return currentUser.avatar;
    }
    return "";
  };

  // Function to get display name
  const getDisplayName = () => {
    return currentUser?.name || "Guest";
  };

  // Function to get display email
  const getDisplayEmail = () => {
    return currentUser?.email || "Not logged in";
  };

  return (
    <div className="w-64 bg-white rounded-r-2xl shadow-sm border-r border-gray-100 fixed h-full z-40 lg:relative lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
      <div className="p-6 h-full flex flex-col">
        {/* Centered Avatar Profile with Edit Button */}
        <div className="flex flex-col items-center text-center mb-8 pt-8 relative">
          {isEditingProfile ? (
            <>
              <div className="relative inline-block">
                <img src={editFormData.avatar || getAvatarUrl()} alt="Profile" className="w-20 h-20 rounded-full border-4 border-white shadow-lg mb-4 object-cover" />
                <button onClick={() => document.getElementById("avatarInput").click()} className="absolute bottom-0 right-0 bg-sky-500 rounded-full p-2 shadow-lg hover:bg-sky-600 transition-colors">
                  <span className="text-white text-xs">📷</span>
                </button>
              </div>
              <input type="file" id="avatarInput" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              <div className="space-y-3 w-full">
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-center"
                  placeholder="Your name"
                />
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 text-gray-600 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-center text-sm"
                  placeholder="Your email"
                />
                <div className="flex space-x-2 justify-center">
                  <button onClick={handleCancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm">
                    Cancel
                  </button>
                  <button onClick={handleSaveProfile} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-all duration-200 text-sm">
                    Save
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <img src={getAvatarUrl()} alt="Profile" className="w-20 h-20 rounded-full border-4 border-white shadow-lg mb-4 object-cover" />
                <button onClick={handleEditProfile} className="absolute bottom-0 right-0 bg-sky-500 rounded-full p-2 shadow-lg hover:bg-sky-600 transition-colors">
                  <span className="text-white text-xs">✏️</span>
                </button>
              </div>
              <div className="mb-2">
                <div className="text-lg font-semibold text-gray-800">{getDisplayName()}</div>
                <div className="text-sm text-gray-600">{getDisplayEmail()}</div>
                {currentUser?.authProvider && <div className="text-xs text-gray-500 mt-1">{currentUser.authProvider === "google" ? "Google Account" : "Email Account"}</div>}
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
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
