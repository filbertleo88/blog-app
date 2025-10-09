// // import React, { useState } from "react";
// // import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
// // import { Link, useNavigate } from "react-router-dom";
// // import { LuSearch as MagnifyingGlassIcon } from "react-icons/lu";
// // import { posts } from "../../../data/posts";

// // // 1. Get all tags
// // const allTags = posts.flatMap(post => post.tags);

// // // 2. Count tag frequency
// // const tagCounts = allTags.reduce((acc, tag) => {
// //   acc[tag] = (acc[tag] || 0) + 1;
// //   return acc;
// // }, {});

// // // 3. Get top 5 tags
// // const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
// // const top5Tags = sortedTags.slice(0, 5);

// // const menuItems = [
// //     { label: "Home", path: "/" },
// //     ...top5Tags.map(tag => ({ label: tag, path: `/tag/${tag}` }))
// // ];

// // const BlogNavbar = ({ activeMenu, onLoginClick }) => {
// //   const [openSideMenu, setOpenSideMenu] = useState(false);
// //   const [isSearchVisible, setIsSearchVisible] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const navigate = useNavigate();

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
// //             <button className="md:hidden text-black -mt-1" onClick={() => setOpenSideMenu(!openSideMenu)}>
// //                 {openSideMenu ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="h-6 w-6" />}
// //             </button>
// //             <Link to="/" className="text-2xl font-bold text-sky-600 tracking-wider">
// //                 Time To Program
// //             </Link>
// //         </div>

// //         {/* CENTER: MENU LIST */}
// //         <nav className="hidden md:flex items-center gap-8">
// //           {menuItems.map((item, index) => {
// //             return (
// //               <Link to={item?.path} key={index} className="relative group">
// //                 <li className={`text-[15px] font-medium list-none ${activeMenu === item.label ? "text-sky-600" : "text-gray-700 hover:text-sky-500"}`}>
// //                   {item.label}
// //                   <span className={`absolute inset-x-0 -bottom-1 h-[2px] bg-sky-500 transition-transform duration-300 origin-left ${activeMenu === item.label ? "scale-x-100" : "scale-x-0"} group-hover:scale-x-100`}></span>
// //                 </li>
// //               </Link>
// //             );
// //           })}
// //         </nav>

// //         {/* RIGHT: SEARCH + LOGIN */}
// //         <div className="flex items-center gap-6">
// //           {isSearchVisible ? (
// //             <form className="relative" onSubmit={handleSearchSubmit}>
// //               <input
// //                 type="text"
// //                 name="search"
// //                 placeholder="Search..."
// //                 className="border-2 rounded-lg py-1 px-2"
// //                 autoFocus
// //                 value={searchQuery}
// //                 onChange={(e) => setSearchQuery(e.target.value)}
// //               />
// //             </form>
// //           ) : (
// //             <button
// //               onClick={() => setIsSearchVisible(true)}
// //               className="hover:text-sky-500 cursor-pointer"
// //             >
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

// import React, { useState, useMemo } from "react";
// import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
// import { Link, useNavigate } from "react-router-dom";
// import { LuSearch as MagnifyingGlassIcon } from "react-icons/lu";

// const BlogNavbar = ({ activeMenu, onLoginClick, posts }) => {
//   const [openSideMenu, setOpenSideMenu] = useState(false);
//   const [isSearchVisible, setIsSearchVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();

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

//   const menuItems = [{ label: "Home", path: "/" }, ...top5Tags.map((tag) => ({ label: tag, path: `/tag/${tag}` }))];

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${searchQuery}`);
//     }
//   };

//   return (
//     <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-7 sticky top-0 z-50">
//       <div className="container mx-auto flex items-center justify-between">
//         {/* LEFT: LOGO */}
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
//             <Link to={item?.path} key={index} className="relative group">
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
//               <input type="text" name="search" placeholder="Search..." className="border-2 rounded-lg py-1 px-2" autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//             </form>
//           ) : (
//             <button onClick={() => setIsSearchVisible(true)} className="hover:text-sky-500 cursor-pointer">
//               <MagnifyingGlassIcon className="text-[22px]" />
//             </button>
//           )}

//           <button onClick={onLoginClick} className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
//             Login / SignUp
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default BlogNavbar;

import React, { useState, useMemo, useEffect } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { LuSearch as MagnifyingGlassIcon } from "react-icons/lu";

const BlogNavbar = ({ activeMenu, onLoginClick, posts: initialPosts }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState(initialPosts || []);
  const [loading, setLoading] = useState(!initialPosts);
  const navigate = useNavigate();

  // Fetch posts if not provided via props
  useEffect(() => {
    if (!initialPosts) {
      const fetchPosts = async () => {
        try {
          const response = await fetch("http://localhost:5009/api/blogposts");
          if (response.ok) {
            const data = await response.json();
            setPosts(data);
          }
        } catch (error) {
          console.error("Failed to fetch posts:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    }
  }, [initialPosts]);

  // Generate top 5 tags dynamically from posts
  const top5Tags = useMemo(() => {
    if (!posts || posts.length === 0) return [];

    // 1. Get all tags
    const allTags = posts.flatMap((post) => post.tags || []);

    // 2. Count tag frequency
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

    // 3. Get top 5 tags
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
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchVisible(false);
      setSearchQuery("");
    }
  };

  const handleSearchBlur = () => {
    // Hide search after a delay to allow form submission
    setTimeout(() => {
      setIsSearchVisible(false);
      setSearchQuery("");
    }, 200);
  };

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-7 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-sky-600 tracking-wider">Time To Program</div>
          <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
        </div>
      </header>
    );
  }

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

        {/* RIGHT: SEARCH + LOGIN */}
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

          <button onClick={onLoginClick} className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
            Login / SignUp
          </button>
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
          </nav>
        </div>
      )}
    </header>
  );
};

export default BlogNavbar;
