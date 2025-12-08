// components/BlogNavbar.jsx
import React, { useState, useMemo, useEffect } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LuSearch as MagnifyingGlassIcon } from "react-icons/lu";
import AuthModal from "../../Auth/AuthModal";
import { useAuth } from "../../../contexts/AuthContext";

const BlogNavbar = ({ activeMenu, posts }) => {
  const { user: currentUser, logout: authLogout } = useAuth();
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle URL changes to open modal with correct view
  useEffect(() => {
    if (location.pathname === "/login") {
      setAuthView("login");
      setIsAuthModalOpen(true);
    } else if (location.pathname === "/register") {
      setAuthView("register");
      setIsAuthModalOpen(true);
    }
  }, [location.pathname]);

  // Check if we're on a dashboard page
  const isDashboardPage = ["/profile", "/blog-posts", "/comments"].includes(location.pathname);

  // Generate top 5 tags dynamically from posts
  const top5Tags = useMemo(() => {
    try {
      let postsArray = [];

      if (Array.isArray(posts)) {
        postsArray = posts;
      } else if (posts && typeof posts === "object") {
        if (Array.isArray(posts.data)) postsArray = posts.data;
        else if (Array.isArray(posts.posts)) postsArray = posts.posts;
        else if (Array.isArray(posts.items)) postsArray = posts.items;
        else if (Array.isArray(posts.results)) postsArray = posts.results;
      }

      if (!postsArray || !Array.isArray(postsArray) || postsArray.length === 0) {
        return [];
      }

      const allTags = [];
      postsArray.forEach((post) => {
        if (post && post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tag) => {
            if (tag && typeof tag === "string" && tag.trim()) {
              allTags.push(tag.trim());
            }
          });
        }
      });

      if (allTags.length === 0) {
        return [];
      }

      const tagCounts = {};
      allTags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });

      const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
      return sortedTags.slice(0, 5);
    } catch (error) {
      console.error("Error in tag generation:", error);
      return [];
    }
  }, [posts]);

  const menuItems = [
    { label: "Home", path: "/" },
    ...top5Tags.map((tag) => ({
      label: tag,
      path: `/tag/${tag}`,
    })),
  ];

  // Safe user data getters
  const getUserName = () => {
    if (!currentUser || !currentUser.name) return "User";
    return currentUser.name.split(" ")[0] || currentUser.name;
  };

  const getUserAvatar = () => {
    if (!currentUser?.avatar) return null;
    const avatar = currentUser.avatar.trim();
    return avatar === "" ? null : avatar;
  };

  const getUserEmail = () => {
    return currentUser?.email || "No email";
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setIsSearchVisible(false);
      setSearchQuery("");
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setIsSearchVisible(false);
      setSearchQuery("");
    }, 200);
  };

  const handleLogout = () => {
    authLogout();
    setShowUserDropdown(false);
    navigate("/");
  };

  const handleAuthButtonClick = () => {
    navigate("/login");
    setAuthView("login");
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    if (location.pathname === "/login" || location.pathname === "/register") {
      const previousPath = document.referrer ? new URL(document.referrer).pathname : "/";
      navigate(previousPath);
    }
  };

  const handleAuthSuccess = (userData) => {
    setIsAuthModalOpen(false);
    navigate("/");
  };

  const handleViewSwitch = (view) => {
    setAuthView(view);
    navigate(view === "login" ? "/login" : "/register", { replace: true });
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-7 sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between">
          {/* LEFT: LOGO & MENU BUTTON */}
          <div className="flex items-center gap-3">
            <button className="md:hidden text-black -mt-1" onClick={() => setOpenSideMenu(!openSideMenu)}>
              {openSideMenu ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="h-6 w-6" />}
            </button>

            <Link to="/" className="text-2xl font-bold text-sky-600 tracking-wider hover:text-sky-700 transition-colors">
              Inkspire
            </Link>
          </div>

          {/* CENTER: MENU LIST - Only show on non-dashboard pages */}
          {!isDashboardPage && (
            <nav className="hidden md:flex items-center gap-8">
              {menuItems.map((item, index) => (
                <Link to={item.path} key={index} className="relative group">
                  <li className={`text-[15px] font-medium list-none ${activeMenu === item.label ? "text-sky-600" : "text-gray-700 hover:text-sky-500"}`}>
                    {item.label}
                    <span className={`absolute inset-x-0 -bottom-1 h-[2px] bg-sky-500 transition-transform duration-300 origin-left ${activeMenu === item.label ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100`}></span>
                  </li>
                </Link>
              ))}
            </nav>
          )}

          {/* RIGHT: SEARCH + USER AUTH */}
          <div className="flex items-center gap-6">
            {/* Search - Only show on non-dashboard pages */}
            {!isDashboardPage && (
              <>
                {isSearchVisible ? (
                  <form className="relative" onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      placeholder="Search posts..."
                      className="border-2 border-gray-300 rounded-lg py-2 px-4 w-48 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={handleSearchBlur}
                    />
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-sky-600 transition-colors">
                      <MagnifyingGlassIcon className="text-lg" />
                    </button>
                  </form>
                ) : (
                  <button onClick={() => setIsSearchVisible(true)} className="hover:text-sky-500 cursor-pointer transition-colors p-2 rounded-lg hover:bg-gray-100">
                    <MagnifyingGlassIcon className="text-[22px]" />
                  </button>
                )}
              </>
            )}

            {/* User Auth Section */}
            {currentUser ? (
              <div className="relative">
                {isDashboardPage ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Welcome, {getUserName()}</span>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-2 bg-gray-50 rounded-full pl-2 pr-4 py-1 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={toggleUserDropdown}
                  >
                    {getUserAvatar() ? (
                      <img src={getUserAvatar()} alt={getUserName()} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm text-gray-600 font-medium">{getUserName().charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">{getUserName()}</span>

                    {/* Dropdown Menu */}
                    {showUserDropdown && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50" onMouseEnter={() => setShowUserDropdown(true)} onMouseLeave={() => setShowUserDropdown(false)}>
                        <div className="p-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-800">{getUserName()}</p>
                          <p className="text-xs text-gray-500 truncate">{getUserEmail()}</p>
                        </div>
                        <div className="p-1">
                          <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors" onClick={() => setShowUserDropdown(false)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            My Profile
                          </Link>
                          <Link to="/blog-posts" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors" onClick={() => setShowUserDropdown(false)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12m0-12a2 2 0 012-2h2a2 2 0 012 2m-6 9v-2"
                              />
                            </svg>
                            My Posts
                          </Link>
                          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors mt-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button onClick={handleAuthButtonClick} className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-4 py-2 rounded-lg hover:opacity-90 transition font-medium shadow-md hover:shadow-lg">
                Login / SignUp
              </button>
            )}
          </div>
        </div>

        {/* MOBILE SIDE MENU - Only shows navigation links */}
        {openSideMenu && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50">
            <nav className="container mx-auto py-4">
              {/* Navigation links only */}
              {menuItems.map((item, index) => (
                <Link to={item.path} key={index} className="block py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-sky-600 transition-colors border-b border-gray-100 last:border-b-0" onClick={() => setOpenSideMenu(false)}>
                  {item.label}
                </Link>
              ))}

              {/* Simple mobile auth section - just Login/SignUp or Logout */}
              <div className="border-t border-gray-200 mt-4 pt-4 px-4">
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      {getUserAvatar() ? (
                        <img src={getUserAvatar()} alt={getUserName()} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-lg text-gray-600 font-medium">{getUserName().charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{getUserName()}</p>
                        <p className="text-xs text-gray-500">{getUserEmail()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpenSideMenu(false);
                      }}
                      className="w-full text-center py-3 bg-gradient-to-r from-red-500 to-red-400 text-white rounded-lg hover:opacity-90 transition font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleAuthButtonClick();
                      setOpenSideMenu(false);
                    }}
                    className="w-full text-center py-3 bg-gradient-to-r from-sky-500 to-cyan-400 text-white rounded-lg hover:opacity-90 transition font-medium"
                  >
                    Login / SignUp
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isVisible={isAuthModalOpen} onClose={handleAuthModalClose} onAuthSuccess={handleAuthSuccess} initialView={authView} onViewSwitch={handleViewSwitch} navigate={navigate} />
    </>
  );
};

export default BlogNavbar;
