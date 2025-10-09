// // import React, { useState, useEffect } from "react";
// // import { useSearchParams } from "react-router-dom";
// // import BlogPostCard from "./BlogPostCard";
// // import BlogLayout from "../../../components/Layouts/BlogLayout/BlogLayout";

// // const SearchPosts = () => {
// //   const [searchParams] = useSearchParams();
// //   const query = searchParams.get("q") || "";
// //   const [posts, setPosts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchPosts = async () => {
// //       try {
// //         setLoading(true);
// //         const response = await fetch(`http://localhost:5009/api/blogposts?q=${query}`);
// //         if (!response.ok) {
// //           throw new Error("Network response was not ok");
// //         }
// //         const data = await response.json();
// //         setPosts(data);
// //       } catch (error) {
// //         setError(error.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (query) {
// //       fetchPosts();
// //     } else {
// //       setPosts([]);
// //       setLoading(false);
// //     }
// //   }, [query]);

// //   if (loading) {
// //     return (
// //       <BlogLayout>
// //         <p>Loading...</p>
// //       </BlogLayout>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <BlogLayout>
// //         <p>Error: {error}</p>
// //       </BlogLayout>
// //     );
// //   }

// //   return (
// //     <BlogLayout>
// //       <h1 className="text-2xl font-bold text-gray-800 mb-8">Search Results for "{query}"</h1>

// //       {posts.length > 0 ? (
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //           {posts.map((post) => (
// //             <BlogPostCard key={post._id} post={post} />
// //           ))}
// //         </div>
// //       ) : (
// //         <p>No posts found for your query.</p>
// //       )}
// //     </BlogLayout>
// //   );
// // };

// // export default SearchPosts;

// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import BlogPostCard from "./BlogPostCard";
// import BlogLayout from "../../../components/Layouts/BlogLayout/BlogLayout";

// const SearchPosts = () => {
//   const [searchParams] = useSearchParams();
//   const query = searchParams.get("q") || "";
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         if (!query.trim()) {
//           setPosts([]);
//           setLoading(false);
//           return;
//         }

//         // Use the correct search endpoint
//         const response = await fetch(`http://localhost:5009/api/blogposts/search?q=${encodeURIComponent(query)}`);

//         if (!response.ok) {
//           throw new Error(`Failed to fetch search results: ${response.status}`);
//         }

//         const data = await response.json();
//         setPosts(data);
//       } catch (error) {
//         setError(error.message);
//         console.error("Search error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, [query]);

//   if (loading) {
//     return (
//       <BlogLayout>
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="animate-pulse">
//             <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {[...Array(4)].map((_, index) => (
//                 <div key={index} className="bg-gray-200 rounded-lg h-64"></div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </BlogLayout>
//     );
//   }

//   if (error) {
//     return (
//       <BlogLayout>
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//             <h2 className="text-red-800 font-semibold mb-2">Search Error</h2>
//             <p className="text-red-600">{error}</p>
//           </div>
//         </div>
//       </BlogLayout>
//     );
//   }

//   return (
//     <BlogLayout>
//       <div className="max-w-6xl mx-auto px-4">
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">Search Results {query && `for "${query}"`}</h1>
//         <p className="text-gray-600 mb-8">{posts.length > 0 ? `Found ${posts.length} post${posts.length !== 1 ? "s" : ""} matching your search` : query ? "No posts found for your search query" : "Enter a search term to find posts"}</p>

//         {posts.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {posts.map((post) => (
//               <BlogPostCard key={post._id || post.id} post={post} />
//             ))}
//           </div>
//         ) : query ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg mb-4">No posts found for "{query}"</p>
//             <p className="text-gray-400">Try different keywords or browse all posts.</p>
//           </div>
//         ) : null}
//       </div>
//     </BlogLayout>
//   );
// };

// export default SearchPosts;

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BlogPostCard from "./BlogPostCard";
import BlogLayout from "../../../components/Layouts/BlogLayout/BlogLayout";

const SearchPosts = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!query.trim()) {
          setPosts([]);
          setLoading(false);
          return;
        }

        // Use the correct search endpoint
        const response = await fetch(`http://localhost:5009/api/blogposts/search?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch search results: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [query]);

  if (loading) {
    return (
      <BlogLayout>
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </BlogLayout>
    );
  }

  if (error) {
    return (
      <BlogLayout>
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold mb-2">Search Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Search Results {query && `for "${query}"`}</h1>
        <p className="text-gray-600 mb-8">{posts.length > 0 ? `Found ${posts.length} post${posts.length !== 1 ? "s" : ""} matching your search` : query ? "No posts found for your search query" : "Enter a search term to find posts"}</p>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post._id || post.id} post={post} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No posts found for "{query}"</p>
            <p className="text-gray-400">Try different keywords or browse all posts.</p>
          </div>
        ) : null}
      </div>
    </BlogLayout>
  );
};

export default SearchPosts;
