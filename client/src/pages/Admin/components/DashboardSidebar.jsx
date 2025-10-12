// pages/Admin/components/DashboardSidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";

const DashboardSidebar = ({ activeNav, onNavChange, onProfileUpdate }) => {
  const { user: currentUser, logout: authLogout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [saving, setSaving] = useState(false);

  // Sync the internal state with the user from auth context
  useEffect(() => {
    // console.log("DashboardSidebar - User from auth context:", currentUser);
    if (currentUser) {
      setEditFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        avatar: currentUser.avatar || "",
      });
    } else {
      setEditFormData({
        name: "",
        email: "",
        avatar: "",
      });
    }
  }, [currentUser]);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/profile" },
    { id: "blog-posts", label: "Blog Posts", icon: "📝", path: "/blog-posts" },
    { id: "comments", label: "Comments", icon: "💬", path: "/comments" },
    { id: "logout", label: "Logout", icon: "🚪", action: "logout" },
  ];

  const handleNavigation = (item) => {
    if (item.action === "logout") {
      authLogout();
      navigate("/");
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

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      console.log("🔍 SAVE PROFILE - Token:", token ? "Exists" : "Missing");

      if (!token) {
        toast.warning("Please login again - no token found");
        authLogout();
        return;
      }

      // Validate current user data
      if (!currentUser || !currentUser.id) {
        toast.warning("User data is invalid. Please login again.");
        authLogout();
        return;
      }

      // Prepare update data
      const updateData = {
        name: editFormData.name.trim(),
        email: editFormData.email.trim(),
      };

      // Handle avatar - only include if changed and not empty
      if (editFormData.avatar && editFormData.avatar !== currentUser?.avatar) {
        updateData.avatar = editFormData.avatar;
      }

      // Validate required fields
      if (!updateData.name) {
        toast.warning("Please enter your name");
        return;
      }

      if (!updateData.email) {
        toast.warning("Please enter your email");
        return;
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
          toast.warning("Session expired. Please login again.");
          authLogout();
          return;
        }
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || "Profile update failed");
      }

      // Success - update user in auth context
      updateUser(data.user);

      // Call parent callback if provided
      if (onProfileUpdate) {
        onProfileUpdate(data.user);
      }

      setIsEditingProfile(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);

      if (error.message.includes("Failed to fetch")) {
        toast.warning("Network error: Cannot connect to server. Please check if your backend is running.");
      } else if (error.message.includes("401")) {
        toast.warning("Session expired. Please login again.");
        authLogout();
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setSaving(false);
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
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.warning("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setEditFormData((prev) => ({
          ...prev,
          avatar: e.target.result,
        }));
      };
      reader.onerror = () => {
        toast.error("Error reading file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setEditFormData((prev) => ({
      ...prev,
      avatar: "",
    }));
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

  // Function to get avatar for display
  const getDisplayAvatar = () => {
    if (isEditingProfile && editFormData.avatar) {
      return editFormData.avatar;
    }
    return getAvatarUrl();
  };

  // Function to check if avatar exists
  const hasAvatar = () => {
    if (isEditingProfile) {
      return !!editFormData.avatar;
    }
    return !!currentUser?.avatar;
  };

  return (
    <div className="w-64 bg-white rounded-r-2xl shadow-sm border-r border-gray-100 fixed h-full z-40 lg:relative lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
      <div className="p-6 h-full flex flex-col">
        {/* Centered Avatar Profile with Edit Button */}
        <div className="flex flex-col items-center text-center mb-8 pt-8 relative">
          {isEditingProfile ? (
            <>
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg mb-4 overflow-hidden">
                  {getDisplayAvatar() ? (
                    <img src={getDisplayAvatar()} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl text-gray-500 font-medium">{getDisplayName().charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>

                {/* Avatar Action Buttons */}
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  <button onClick={() => document.getElementById("avatarInput").click()} className="bg-sky-500 rounded-full p-2 shadow-lg hover:bg-sky-600 transition-colors" title="Change Avatar">
                    <span className="text-white text-xs">📷</span>
                  </button>
                  {hasAvatar() && (
                    <button onClick={handleRemoveAvatar} className="bg-red-500 rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors" title="Remove Avatar">
                      <span className="text-white text-xs">🗑️</span>
                    </button>
                  )}
                </div>
              </div>

              <input type="file" id="avatarInput" className="hidden" accept="image/*" onChange={handleAvatarChange} />

              <div className="space-y-3 w-full">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 rounded-lg px-3 py-2 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-center"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 rounded-lg px-3 py-2 text-gray-600 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-center text-sm"
                    placeholder="Your email"
                  />
                </div>
                <div className="flex space-x-2 justify-center">
                  <button onClick={handleCancelEdit} disabled={saving} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg mb-4 overflow-hidden">
                  {hasAvatar() ? (
                    <img src={getDisplayAvatar()} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center">
                      <span className="text-2xl text-white font-bold">{getDisplayName().charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <button onClick={handleEditProfile} className="absolute bottom-0 right-0 bg-sky-500 rounded-full p-2 shadow-lg hover:bg-sky-600 transition-colors" title="Edit Profile">
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
                currentActiveNav === item.id ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg transform scale-105" : "text-gray-700 hover:bg-gray-50 hover:shadow-md hover:scale-105"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 mt-4">
          <div className="text-xs text-gray-500 text-center">
            <p>Inkspire</p>
            <p className="mt-1">Dashboard v1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
