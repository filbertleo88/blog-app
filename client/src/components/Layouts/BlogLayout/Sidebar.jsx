// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// const Sidebar = () => {
//   const [recentPosts, setRecentPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await fetch("http://localhost:5009/api/blogposts");
//         if (!response.ok) {
//           throw new Error("Failed to fetch posts");
//         }
//         const postsData = await response.json();

//         console.log("Raw posts data:", postsData); // Debug log

//         // Sort by date (newest first)
//         const sortedPosts = postsData.sort((a, b) => {
//           // Helper function to parse dates
//           const parseDate = (post) => {
//             // Priority 1: Use createdAt (ISO date)
//             if (post.createdAt) {
//               return new Date(post.createdAt).getTime();
//             }

//             // Priority 2: Parse the date string (e.g., "Oct 8, 2025")
//             if (post.date) {
//               try {
//                 // Handle format like "Oct 8, 2025"
//                 const dateString = post.date.replace(",", "");
//                 const parsedDate = new Date(dateString);
//                 if (!isNaN(parsedDate.getTime())) {
//                   return parsedDate.getTime();
//                 }
//               } catch (error) {
//                 console.warn("Failed to parse date:", post.date);
//               }
//             }

//             // Fallback: Use current date (will push to bottom)
//             return Date.now();
//           };

//           const timeA = parseDate(a);
//           const timeB = parseDate(b);

//           // Sort descending (newest first)
//           return timeB - timeA;
//         });

//         console.log(
//           "Sorted posts:",
//           sortedPosts.map((p) => ({
//             title: p.title,
//             date: p.date,
//             createdAt: p.createdAt,
//           }))
//         ); // Debug log

//         const top5Posts = sortedPosts.slice(0, 5);
//         setRecentPosts(top5Posts);
//       } catch (error) {
//         console.error("Failed to fetch posts:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, []);

//   // Format date for display
//   const formatDate = (post) => {
//     if (post.date) {
//       return post.date;
//     }
//     if (post.createdAt) {
//       return new Date(post.createdAt).toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       });
//     }
//     return "Recent";
//   };

//   if (loading) {
//     return (
//       <aside className="bg-white p-4 rounded-xl shadow-sm">
//         <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Latest Posts</h2>
//         <div className="space-y-4">
//           {[...Array(5)].map((_, index) => (
//             <div key={index} className="flex items-start gap-4">
//               <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
//               <div className="flex-1 min-w-0">
//                 <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
//                 <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </aside>
//     );
//   }

//   return (
//     <aside className="bg-white p-4 rounded-xl shadow-sm">
//       <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Latest Posts</h2>
//       <div>
//         {recentPosts.map((post, index) => (
//           <Link to={`/blogposts/${post._id || post.id}`} key={post._id || post.id} className="group block hover:bg-gray-50 rounded-lg transition-colors duration-200 p-2 -mx-2">
//             <div className="flex items-start gap-3 mb-4">
//               <div className="relative">
//                 <img src={post.image || `https://source.unsplash.com/150x150/?${post.tags?.[0] || "tech"}`} alt={post.title} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
//                 {index === 0 && <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-xs px-1 rounded-full">NEW</span>}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-semibold text-gray-800 group-hover:text-sky-500 transition line-clamp-2 leading-tight mb-1">{post.title}</p>
//                 <p className="text-xs text-gray-500 line-clamp-2 mb-1">{post.description?.substring(0, 50) || "No description"}...</p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs text-gray-400">{formatDate(post)}</span>
//                   {post.tags?.[0] && <span className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">#{post.tags[0]}</span>}
//                 </div>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>

//       {recentPosts.length === 0 && (
//         <div className="text-center py-4 text-gray-500">
//           <p className="text-sm">No posts available</p>
//         </div>
//       )}
//     </aside>
//   );
// };

// export default Sidebar;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to parse "Nov 5, 2025" format
  const parseDate = (dateString) => {
    if (!dateString) return new Date(0); // Return very old date if no date

    try {
      // Handle "Nov 5, 2025" format
      const [month, day, year] = dateString.replace(",", "").split(" ");
      const monthNames = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
      };

      if (monthNames.hasOwnProperty(month)) {
        return new Date(parseInt(year), monthNames[month], parseInt(day));
      }
    } catch (error) {
      console.warn("Failed to parse date:", dateString);
    }

    // Fallback to very old date
    return new Date(0);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5009/api/blogposts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const postsData = await response.json();

        console.log(
          "Sidebar - Raw posts:",
          postsData.map((p) => ({ title: p.title, date: p.date }))
        ); // Debug

        // Sort by date (newest first) using the custom parser
        const sortedPosts = postsData.sort((a, b) => {
          const dateA = parseDate(a.date);
          const dateB = parseDate(b.date);
          return dateB - dateA; // Newest first
        });

        console.log(
          "Sidebar - Sorted posts:",
          sortedPosts.map((p) => ({ title: p.title, date: p.date }))
        ); // Debug

        const top5Posts = sortedPosts.slice(0, 5);
        setRecentPosts(top5Posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Format date for display (just return the original date string)
  const formatDate = (post) => {
    return post.date || "Recent";
  };

  if (loading) {
    return (
      <aside className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Latest Posts</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Latest Posts</h2>
      <div>
        {recentPosts.map((post, index) => (
          <Link to={`/blogposts/${post._id || post.id}`} key={post._id || post.id} className="group block hover:bg-gray-50 rounded-lg transition-colors duration-200 p-2 -mx-2">
            <div className="flex items-start gap-3 mb-4">
              <div className="relative flex-shrink-0">
                <img src={post.image || `https://source.unsplash.com/150x150/?${post.tags?.[0] || "tech"}`} alt={post.title} className="w-14 h-14 object-cover rounded-lg" />
                {index === 0 && <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-xs px-1 rounded-full">NEW</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-sky-500 transition line-clamp-2 leading-tight mb-1">{post.title}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mb-1">{post.description?.substring(0, 50) || "No description"}...</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{formatDate(post)}</span>
                  {post.tags?.[0] && <span className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">#{post.tags[0]}</span>}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {recentPosts.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">No posts available</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
