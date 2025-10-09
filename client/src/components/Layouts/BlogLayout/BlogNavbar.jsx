// // // import React, { useState } from "react";
// // // import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
// // // import { Link, useNavigate } from "react-router-dom";
// // // import { LuSearch as MagnifyingGlassIcon } from "react-icons/lu";
// // // import { posts } from "../../../data/posts";

// // // // 1. Get all tags
// // // const allTags = posts.flatMap(post => post.tags);

// // // // 2. Count tag frequency
// // // const tagCounts = allTags.reduce((acc, tag) => {
// // //   acc[tag] = (acc[tag] || 0) + 1;
// // //   return acc;
// // // }, {});

// // // // 3. Get top 5 tags
// // // const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
// // // const top5Tags = sortedTags.slice(0, 5);

// // // const menuItems = [
// // //     { label: "Home", path: "/" },
// // //     ...top5Tags.map(tag => ({ label: tag, path: `/tag/${tag}` }))
// // // ];

// // // const BlogNavbar = ({ activeMenu, onLoginClick }) => {
// // //   const [openSideMenu, setOpenSideMenu] = useState(false);
// // //   const [isSearchVisible, setIsSearchVisible] = useState(false);
// // //   const [searchQuery, setSearchQuery] = useState("");
// // //   const navigate = useNavigate();

// // //   const handleSearchSubmit = (e) => {
// // //     e.preventDefault();
// // //     if (searchQuery.trim()) {
// // //       navigate(`/search?q=${searchQuery}`);
// // //     }
// // //   };

// // //   return (
// // //     <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-7 sticky top-0 z-50">
// // //       <div className="container mx-auto flex items-center justify-between">
// // //         {/* LEFT: LOGO */}
// // //         <div className="flex items-center gap-3">
// // //             <button className="md:hidden text-black -mt-1" onClick={() => setOpenSideMenu(!openSideMenu)}>
// // //                 {openSideMenu ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="h-6 w-6" />}
// // //             </button>
// // //             <Link to="/" className="text-2xl font-bold text-sky-600 tracking-wider">
// // //                 Time To Program
// // //             </Link>
// // //         </div>

// // //         {/* CENTER: MENU LIST */}
// // //         <nav className="hidden md:flex items-center gap-8">
// // //           {menuItems.map((item, index) => {
// // //             return (
// // //               <Link to={item?.path} key={index} className="relative group">
// // //                 <li className={`text-[15px] font-medium list-none ${activeMenu === item.label ? "text-sky-600" : "text-gray-700 hover:text-sky-500"}`}>
// // //                   {item.label}
// // //                   <span className={`absolute inset-x-0 -bottom-1 h-[2px] bg-sky-500 transition-transform duration-300 origin-left ${activeMenu === item.label ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100`}></span>
// // //                 </li>
// // //               </Link>
// // //             );
// // //           })}
// // //         </nav>

// // //         {/* RIGHT: SEARCH + LOGIN */}
// // //         <div className="flex items-center gap-6">
// // //           {isSearchVisible ? (
// // //             <form className="relative" onSubmit={handleSearchSubmit}>
// // //               <input
// // //                 type="text"
// // //                 name="search"
// // //                 placeholder="Search..."
// // //                 className="border-2 rounded-lg py-1 px-2"
// // //                 autoFocus
// // //                 value={searchQuery}
// // //                 onChange={(e) => setSearchQuery(e.target.value)}
// // //               />
// // //             </form>
// // //           ) : (
// // //             <button
// // //               onClick={() => setIsSearchVisible(true)}
// // //               className="hover:text-sky-500 cursor-pointer"
// // //             >
// // //               <MagnifyingGlassIcon className="text-[22px]" />
// // //             </button>
// // //           )}

// // //           <button onClick={onLoginClick} className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
// // //             Login / SignUp
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </header>
// // //   );
// // // };

// // // export default BlogNavbar;

// // import React, { useState, useMemo } from "react";
// // import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
// // import { Link, useNavigate } from "react-router-dom";
// // import { LuSearch as MagnifyingGlassIcon } from "react-icons/lu";

// // const BlogNavbar = ({ activeMenu, onLoginClick, posts }) => {
// //   const [openSideMenu, setOpenSideMenu] = useState(false);
// //   const [isSearchVisible, setIsSearchVisible] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const navigate = useNavigate();

// //   // Generate top 5 tags dynamically from posts
// //   const top5Tags = useMemo(() => {
// //     if (!posts || posts.length === 0) return [];

// //     // 1. Get all tags
// //     const allTags = posts.flatMap((post) => post.tags || []);

// //     // 2. Count tag frequency
// //     const tagCounts = allTags.reduce((acc, tag) => {
// //       acc[tag] = (acc[tag] || 0) + 1;
// //       return acc;
// //     }, {});

// //     // 3. Get top 5 tags
// //     const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
// //     return sortedTags.slice(0, 5);
// //   }, [posts]);

// //   const menuItems = [{ label: "Home", path: "/" }, ...top5Tags.map((tag) => ({ label: tag, path: `/tag/${tag}` }))];

// //   const handleSearchSubmit = (e) => {
// //     e.preventDefault();
// //     if (searchQuery.trim()) {
// //       navigate(`/search?q=${searchQuery}`);
// //     }
// //   };

// //   return (
// //     <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-7 sticky top-0 z-50">
// //       <div className="container mx-auto flex items-center justify-between">
// //         {/* LEFT: LOGO */}
// //         <div className="flex items-center gap-3">
// //           <button className="md:hidden text-black -mt-1" onClick={() => setOpenSideMenu(!openSideMenu)}>
// //             {openSideMenu ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="h-6 w-6" />}
// //           </button>
// //           <Link to="/" className="text-2xl font-bold text-sky-600 tracking-wider">
// //             Time To Program
// //           </Link>
// //         </div>

// //         {/* CENTER: MENU LIST */}
// //         <nav className="hidden md:flex items-center gap-8">
// //           {menuItems.map((item, index) => (
// //             <Link to={item?.path} key={index} className="relative group">
// //               <li className={`text-[15px] font-medium list-none ${activeMenu === item.label ? "text-sky-600" : "text-gray-700 hover:text-sky-500"}`}>
// //                 {item.label}
// //                 <span className={`absolute inset-x-0 -bottom-1 h-[2px] bg-sky-500 transition-transform duration-300 origin-left ${activeMenu === item.label ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100`}></span>
// //               </li>
// //             </Link>
// //           ))}
// //         </nav>

// //         {/* RIGHT: SEARCH + LOGIN */}
// //         <div className="flex items-center gap-6">
// //           {isSearchVisible ? (
// //             <form className="relative" onSubmit={handleSearchSubmit}>
// //               <input type="text" name="search" placeholder="Search..." className="border-2 rounded-lg py-1 px-2" autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
// //             </form>
// //           ) : (
// //             <button onClick={() => setIsSearchVisible(true)} className="hover:text-sky-500 cursor-pointer">
// //               <MagnifyingGlassIcon className="text-[22px]" />
// //             </button>
// //           )}

// //           <button onClick={onLoginClick} className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
// //             Login / SignUp
// //           </button>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // };

// // export default BlogNavbar;

// import React, { useState, useMemo, useEffect } from "react";
// import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
// import { Link, useNavigate } from "react-router-dom";
// import { LuSearch as MagnifyingGlassIcon } from "react-icons/lu";

// const BlogNavbar = ({ activeMenu, onLoginClick, posts: initialPosts }) => {
//   const [openSideMenu, setOpenSideMenu] = useState(false);
//   const [isSearchVisible, setIsSearchVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [posts, setPosts] = useState(initialPosts || []);
//   const [loading, setLoading] = useState(!initialPosts);
//   const navigate = useNavigate();

//   // Fetch posts if not provided via props
//   useEffect(() => {
//     if (!initialPosts) {
//       const fetchPosts = async () => {
//         try {
//           const response = await fetch("http://localhost:5009/api/blogposts");
//           if (response.ok) {
//             const data = await response.json();
//             setPosts(data);
//           }
//         } catch (error) {
//           console.error("Failed to fetch posts:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchPosts();
//     }
//   }, [initialPosts]);

//   // Generate top 5 tags dynamically from posts
//   const top5Tags = useMemo(() => {
//     if (!posts || posts.length === 0) return [];

//     // 1. Get all tags
//     const allTags = posts.flatMap((post) => post.tags || []);

//     // 2. Count tag frequency
//     const tagCounts = allTags.reduce((acc, tag) => {
//       acc[tag] = (acc[tag] || 0) + 1;
//       return acc;
//     }, {});

//     // 3. Get top 5 tags
//     const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
//     return sortedTags.slice(0, 5);
//   }, [posts]);

//   const menuItems = [
//     { label: "Home", path: "/" },
//     ...top5Tags.map((tag) => ({
//       label: tag,
//       path: `/tag/${tag}`,
//     })),
//   ];

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//       setIsSearchVisible(false);
//       setSearchQuery("");
//     }
//   };

//   const handleSearchBlur = () => {
//     // Hide search after a delay to allow form submission
//     setTimeout(() => {
//       setIsSearchVisible(false);
//       setSearchQuery("");
//     }, 200);
//   };

//   if (loading) {
//     return (
//       <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-7 sticky top-0 z-50">
//         <div className="container mx-auto flex items-center justify-between">
//           <div className="text-2xl font-bold text-sky-600 tracking-wider">Time To Program</div>
//           <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
//         </div>
//       </header>
//     );
//   }

//   return (
//     <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-7 sticky top-0 z-50">
//       <div className="container mx-auto flex items-center justify-between">
//         {/* LEFT: LOGO & MENU BUTTON */}
//         <div className="flex items-center gap-3">
//           <button className="md:hidden text-black -mt-1" onClick={() => setOpenSideMenu(!openSideMenu)}>
//             {openSideMenu ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="h-6 w-6" />}
//           </button>
//           <Link to="/" className="text-2xl font-bold text-sky-600 tracking-wider">
//             Time To Program
//           </Link>
//         </div>

//         {/* CENTER: MENU LIST */}
//         <nav className="hidden md:flex items-center gap-8">
//           {menuItems.map((item, index) => (
//             <Link to={item.path} key={index} className="relative group">
//               <li className={`text-[15px] font-medium list-none ${activeMenu === item.label ? "text-sky-600" : "text-gray-700 hover:text-sky-500"}`}>
//                 {item.label}
//                 <span className={`absolute inset-x-0 -bottom-1 h-[2px] bg-sky-500 transition-transform duration-300 origin-left ${activeMenu === item.label ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100`}></span>
//               </li>
//             </Link>
//           ))}
//         </nav>

//         {/* RIGHT: SEARCH + LOGIN */}
//         <div className="flex items-center gap-6">
//           {isSearchVisible ? (
//             <form className="relative" onSubmit={handleSearchSubmit}>
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="border-2 border-gray-300 rounded-lg py-1 px-3 w-48 focus:outline-none focus:border-sky-500"
//                 autoFocus
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onBlur={handleSearchBlur}
//               />
//             </form>
//           ) : (
//             <button onClick={() => setIsSearchVisible(true)} className="hover:text-sky-500 cursor-pointer transition-colors">
//               <MagnifyingGlassIcon className="text-[22px]" />
//             </button>
//           )}

//           <button onClick={onLoginClick} className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
//             Login / SignUp
//           </button>
//         </div>
//       </div>

//       {/* MOBILE SIDE MENU */}
//       {openSideMenu && (
//         <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg">
//           <nav className="container mx-auto py-4">
//             {menuItems.map((item, index) => (
//               <Link to={item.path} key={index} className="block py-2 px-4 text-gray-700 hover:bg-gray-50 hover:text-sky-600" onClick={() => setOpenSideMenu(false)}>
//                 {item.label}
//               </Link>
//             ))}
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// };

// export default BlogNavbar;

// import React, { useState, useMemo, useEffect } from "react";
// import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
// import { Link, useNavigate } from "react-router-dom";
// import { LuSearch as MagnifyingGlassIcon } from "react-icons/lu";

// const BlogNavbar = ({ activeMenu, onLoginClick, posts }) => {
//   const [openSideMenu, setOpenSideMenu] = useState(false);
//   const [isSearchVisible, setIsSearchVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   // Check if user is logged in on component mount
//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       setUser(JSON.parse(userData));
//     }
//   }, []);

//   // Generate top 5 tags dynamically from posts
//   const top5Tags = useMemo(() => {
//     if (!posts || posts.length === 0) return [];

//     // 1. Get all tags
//     const allTags = posts.flatMap((post) => post.tags || []);

//     // 2. Count tag frequency
//     const tagCounts = allTags.reduce((acc, tag) => {
//       acc[tag] = (acc[tag] || 0) + 1;
//       return acc;
//     }, {});

//     // 3. Get top 5 tags
//     const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
//     return sortedTags.slice(0, 5);
//   }, [posts]);

//   const menuItems = [
//     { label: "Home", path: "/" },
//     ...top5Tags.map((tag) => ({
//       label: tag,
//       path: `/tag/${tag}`,
//     })),
//   ];

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${searchQuery}`);
//     }
//   };

//   const handleSearchBlur = () => {
//     // Hide search after a delay to allow form submission
//     setTimeout(() => {
//       setIsSearchVisible(false);
//       setSearchQuery("");
//     }, 200);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     // Optional: Redirect to home page
//     navigate("/");
//   };

//   const handleLoginClick = () => {
//     if (onLoginClick) {
//       onLoginClick();
//     }
//   };

//   return (
//     <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-7 sticky top-0 z-50">
//       <div className="container mx-auto flex items-center justify-between">
//         {/* LEFT: LOGO & MENU BUTTON */}
//         <div className="flex items-center gap-3">
//           <button className="md:hidden text-black -mt-1" onClick={() => setOpenSideMenu(!openSideMenu)}>
//             {openSideMenu ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="h-6 w-6" />}
//           </button>
//           <Link to="/" className="text-2xl font-bold text-sky-600 tracking-wider">
//             Time To Program
//           </Link>
//         </div>

//         {/* CENTER: MENU LIST */}
//         <nav className="hidden md:flex items-center gap-8">
//           {menuItems.map((item, index) => (
//             <Link to={item.path} key={index} className="relative group">
//               <li className={`text-[15px] font-medium list-none ${activeMenu === item.label ? "text-sky-600" : "text-gray-700 hover:text-sky-500"}`}>
//                 {item.label}
//                 <span className={`absolute inset-x-0 -bottom-1 h-[2px] bg-sky-500 transition-transform duration-300 origin-left ${activeMenu === item.label ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100`}></span>
//               </li>
//             </Link>
//           ))}
//         </nav>

//         {/* RIGHT: SEARCH + USER AUTH */}
//         <div className="flex items-center gap-6">
//           {isSearchVisible ? (
//             <form className="relative" onSubmit={handleSearchSubmit}>
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="border-2 border-gray-300 rounded-lg py-1 px-3 w-48 focus:outline-none focus:border-sky-500"
//                 autoFocus
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onBlur={handleSearchBlur}
//               />
//             </form>
//           ) : (
//             <button onClick={() => setIsSearchVisible(true)} className="hover:text-sky-500 cursor-pointer transition-colors">
//               <MagnifyingGlassIcon className="text-[22px]" />
//             </button>
//           )}

//           {/* User Auth Section */}
//           {user ? (
//             <div className="flex items-center gap-3">
//               {/* User Avatar and Name */}
//               <div className="flex items-center gap-2 bg-gray-50 rounded-full pl-2 pr-4 py-1 hover:bg-gray-100 transition-colors cursor-pointer group relative">
//                 <img src={user.avatar || "https://i.pravatar.cc/150"} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
//                 <span className="text-sm font-medium text-gray-700">{user.name}</span>

//                 {/* Dropdown Menu */}
//                 <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                   <div className="p-3 border-b border-gray-100">
//                     <p className="text-sm font-medium text-gray-800">{user.name}</p>
//                     <p className="text-xs text-gray-500 truncate">{user.email}</p>
//                   </div>
//                   <div className="p-1">
//                     <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                       My Profile
//                     </Link>
//                     <Link to="/my-posts" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12m0-12a2 2 0 012-2h2a2 2 0 012 2m-6 9v-2"
//                         />
//                       </svg>
//                       My Posts
//                     </Link>
//                     <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors mt-1">
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                       </svg>
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <button onClick={handleLoginClick} className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-4 py-2 rounded-lg hover:opacity-90 transition font-medium">
//               Login / SignUp
//             </button>
//           )}
//         </div>
//       </div>

//       {/* MOBILE SIDE MENU */}
//       {openSideMenu && (
//         <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg">
//           <nav className="container mx-auto py-4">
//             {menuItems.map((item, index) => (
//               <Link to={item.path} key={index} className="block py-2 px-4 text-gray-700 hover:bg-gray-50 hover:text-sky-600" onClick={() => setOpenSideMenu(false)}>
//                 {item.label}
//               </Link>
//             ))}

//             {/* Mobile User Section */}
//             {user && (
//               <div className="border-t border-gray-200 mt-4 pt-4 px-4">
//                 <div className="flex items-center gap-3 mb-3">
//                   <img src={user.avatar || "https://i.pravatar.cc/150"} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-800">{user.name}</p>
//                     <p className="text-xs text-gray-500">{user.email}</p>
//                   </div>
//                 </div>
//                 <Link to="/profile" className="block py-2 text-gray-700 hover:text-sky-600" onClick={() => setOpenSideMenu(false)}>
//                   My Profile
//                 </Link>
//                 <Link to="/my-posts" className="block py-2 text-gray-700 hover:text-sky-600" onClick={() => setOpenSideMenu(false)}>
//                   My Posts
//                 </Link>
//                 <button
//                   onClick={() => {
//                     handleLogout();
//                     setOpenSideMenu(false);
//                   }}
//                   className="block w-full text-left py-2 text-red-600 hover:text-red-700"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// };

// export default BlogNavbar;


import React, { useState, useMemo, useEffect } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { LuSearch as MagnifyingGlassIcon } from "react-icons/lu";

const BlogNavbar = ({ activeMenu, onLoginClick, posts, user }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(user);
  const navigate = useNavigate();

  // Update currentUser when user prop changes
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  // Also check localStorage on component mount as backup
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && !currentUser) {
      setCurrentUser(JSON.parse(userData));
    }
  }, [currentUser]);

  // Generate top 5 tags dynamically from posts
  const top5Tags = useMemo(() => {
    if (!posts || posts.length === 0) return [];

    const allTags = posts.flatMap((post) => post.tags || []);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

    const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
    return sortedTags.slice(0, 5);
  }, [posts]);

  const menuItems = [
    { label: "Home", path: "/" },
    ...top5Tags.map((tag) => ({
      label: tag,
      path: `/tag/${tag}`,
    })),
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setIsSearchVisible(false);
      setSearchQuery("");
    }, 200);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/");
    window.location.reload(); // Force refresh to update all components
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-7 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* LEFT: LOGO & MENU BUTTON */}
        <div className="flex items-center gap-3">
          <button className="md:hidden text-black -mt-1" onClick={() => setOpenSideMenu(!openSideMenu)}>
            {openSideMenu ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="h-6 w-6" />}
          </button>
          <Link to="/" className="text-2xl font-bold text-sky-600 tracking-wider">
            Time To Program
          </Link>
        </div>

        {/* CENTER: MENU LIST */}
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

        {/* RIGHT: SEARCH + USER AUTH */}
        <div className="flex items-center gap-6">
          {isSearchVisible ? (
            <form className="relative" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search..."
                className="border-2 border-gray-300 rounded-lg py-1 px-3 w-48 focus:outline-none focus:border-sky-500"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={handleSearchBlur}
              />
            </form>
          ) : (
            <button onClick={() => setIsSearchVisible(true)} className="hover:text-sky-500 cursor-pointer transition-colors">
              <MagnifyingGlassIcon className="text-[22px]" />
            </button>
          )}

          {/* User Auth Section */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* User Avatar and Name */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-full pl-2 pr-4 py-1 hover:bg-gray-100 transition-colors cursor-pointer group relative">
                <img src={currentUser.avatar || "https://i.pravatar.cc/150"} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {currentUser.name.split(' ')[0]} {/* Show only first name */}
                </span>

                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                  </div>
                  <div className="p-1">
                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </Link>
                    <Link to="/my-posts" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12m0-12a2 2 0 012-2h2a2 2 0 012 2m-6 9v-2" />
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
              </div>
            </div>
          ) : (
            <button onClick={handleLoginClick} className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-4 py-2 rounded-lg hover:opacity-90 transition font-medium">
              Login / SignUp
            </button>
          )}
        </div>
      </div>

      {/* MOBILE SIDE MENU */}
      {openSideMenu && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg">
          <nav className="container mx-auto py-4">
            {menuItems.map((item, index) => (
              <Link to={item.path} key={index} className="block py-2 px-4 text-gray-700 hover:bg-gray-50 hover:text-sky-600" onClick={() => setOpenSideMenu(false)}>
                {item.label}
              </Link>
            ))}

            {/* Mobile User Section */}
            {currentUser && (
              <div className="border-t border-gray-200 mt-4 pt-4 px-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src={currentUser.avatar || "https://i.pravatar.cc/150"} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                </div>
                <Link to="/profile" className="block py-2 text-gray-700 hover:text-sky-600" onClick={() => setOpenSideMenu(false)}>
                  My Profile
                </Link>
                <Link to="/my-posts" className="block py-2 text-gray-700 hover:text-sky-600" onClick={() => setOpenSideMenu(false)}>
                  My Posts
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpenSideMenu(false);
                  }}
                  className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default BlogNavbar;