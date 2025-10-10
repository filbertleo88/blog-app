// // import React, { useState, useEffect } from "react";
// // import { useParams } from "react-router-dom";
// // import BlogLayout from "../../../components/Layouts/BlogLayout/BlogLayout";
// // import ModernCommentSection from "../../../components/ModernCommentSection";

// // const BlogPostView = () => {
// //   const { id } = useParams();
// //   const [post, setPost] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchPost = async () => {
// //       try {
// //         setLoading(true);
// //         const response = await fetch(`http://localhost:5009/api/blogposts/${id}`);
// //         if (!response.ok) {
// //           throw new Error("Network response was not ok");
// //         }
// //         const data = await response.json();
// //         setPost(data);
// //       } catch (error) {
// //         setError(error.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchPost();
// //   }, [id]);

// //   if (loading) {
// //     return (
// //       <BlogLayout>
// //         <div className="max-w-4xl mx-auto">
// //           <p>Loading...</p>
// //         </div>
// //       </BlogLayout>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <BlogLayout>
// //         <div className="max-w-4xl mx-auto">
// //           <p>Error: {error}</p>
// //         </div>
// //       </BlogLayout>
// //     );
// //   }

// //   if (!post) {
// //     return (
// //       <BlogLayout>
// //         <div className="max-w-4xl mx-auto">
// //           <p>Post not found.</p>
// //         </div>
// //       </BlogLayout>
// //     );
// //   }
// //   // <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
// //   return (
// //     <BlogLayout>
// //       <div className="max-w-4xl mx-auto px-4 py-8">
// //         {/* Blog Post Header */}
// //         <article className="mb-12">
// //           {/* Blog Post Image */}
// //           {post.image && (
// //             <div className="mb-8">
// //               <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg shadow-md" />
// //             </div>
// //           )}
// //           <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">{post.title}</h1>
// //           <div className="text-gray-600 mb-8">
// //             <span>By {post.author?.name || "Unknown Author"}</span>
// //             <span className="mx-2">•</span>
// //             <span>{post.date || new Date(post.createdAt).toLocaleDateString()}</span>
// //           </div>
// //           <div className="prose prose-lg max-w-none mb-8">{post.content || post.description}</div>
// //           <div className="mt-8">
// //             {post.tags?.map((tag) => (
// //               <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
// //                 #{tag}
// //               </span>
// //             ))}
// //           </div>
// //         </article>

// //         {/* Comments Section */}
// //         <section className="border-t border-gray-200 pt-8">
// //           <ModernCommentSection />
// //         </section>
// //       </div>
// //     </BlogLayout>
// //   );
// // };

// // export default BlogPostView;

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import BlogLayout from "../../../components/Layouts/BlogLayout/BlogLayout";
// import ModernCommentSection from "../../../components/ModernCommentSection";

// const BlogPostView = () => {
//   const { id } = useParams();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isLiked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   const [viewCount, setViewCount] = useState(0);

//   // Check if user has already liked this post
//   useEffect(() => {
//     const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
//     setIsLiked(!!likedPosts[id]);
//   }, [id]);

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`http://localhost:5009/api/blogposts/${id}`);
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         setPost(data);
//         setLikeCount(data.likes || 0);
//         setViewCount(data.views || 0);

//         // Increment view count
//         incrementViewCount();
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPost();
//   }, [id]);

//   const incrementViewCount = async () => {
//     try {
//       // Update view count in backend
//       await fetch(`http://localhost:5009/api/blogposts/${id}/views`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       // Update local state
//       setViewCount((prev) => prev + 1);
//     } catch (error) {
//       console.error("Failed to update view count:", error);
//     }
//   };

//   const handleLike = async () => {
//     try {
//       const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");

//       if (isLiked) {
//         // Unlike the post
//         await fetch(`http://localhost:5009/api/blogposts/${id}/unlike`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         setLikeCount((prev) => prev - 1);
//         delete likedPosts[id];
//       } else {
//         // Like the post
//         await fetch(`http://localhost:5009/api/blogposts/${id}/like`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         setLikeCount((prev) => prev + 1);
//         likedPosts[id] = true;
//       }

//       setIsLiked(!isLiked);
//       localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
//     } catch (error) {
//       console.error("Failed to update like:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <BlogLayout>
//         <div className="max-w-4xl mx-auto">
//           <p>Loading...</p>
//         </div>
//       </BlogLayout>
//     );
//   }

//   if (error) {
//     return (
//       <BlogLayout>
//         <div className="max-w-4xl mx-auto">
//           <p>Error: {error}</p>
//         </div>
//       </BlogLayout>
//     );
//   }

//   if (!post) {
//     return (
//       <BlogLayout>
//         <div className="max-w-4xl mx-auto">
//           <p>Post not found.</p>
//         </div>
//       </BlogLayout>
//     );
//   }

//   return (
//     <BlogLayout>
//       <div className="max-w-4xl mx-auto px-4 py-8">
// {/* Blog Post Header */}
// <article className="mb-12">
//   {/* Blog Post Image */}
//   {post.image && (
//     <div className="mb-8">
//       <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg shadow-md" />
//     </div>
//   )}
//   <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">{post.title}</h1>
//   <div className="text-gray-600 mb-8">
//     <span>By {post.author?.name || "Unknown Author"}</span>
//     <span className="mx-2">•</span>
//     <span>{post.date || new Date(post.createdAt).toLocaleDateString()}</span>
//   </div>
//   <div className="prose prose-lg max-w-none mb-8">{post.content || post.description}</div>
//   <div className="mt-8">
//     {post.tags?.map((tag) => (
//       <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
//         #{tag}
//       </span>
//     ))}
//   </div>
// </article>

//         {/* Comments Section */}
//         <section className="border-t border-gray-200 pt-8">
//           <ModernCommentSection />
//         </section>
//       </div>

//       {/* Floating Like and View Counter */}
//       <FloatingPostStats likeCount={likeCount} viewCount={viewCount} isLiked={isLiked} onLike={handleLike} />
//     </BlogLayout>
//   );
// };

// // Floating Post Stats Component - Compact Side by Side Version
// const FloatingPostStats = ({ likeCount, viewCount, isLiked, onLike }) => {
//   return (
//     <div className="fixed bottom-6 right-6 z-40 animate-pop">
//       <div className="bg-gradient-to-r from-sky-400 to-cyan-500 text-white backdrop-blur-md rounded-2xl shadow-xl border border-white/20 px-4 py-3 flex items-center gap-4 transition-transform duration-300 hover:scale-105">
//         {/* View Counter */}
//         <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-xl shadow-inner">
//           <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274
//               4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//             />
//           </svg>
//           <span className="text-sm font-semibold">{viewCount}</span>
//         </div>

//         {/* Like Button */}
//         <button
//           onClick={onLike}
//           className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 ease-in-out ${isLiked ? "bg-white text-red-500 shadow-lg scale-105" : "bg-white/20 text-white hover:bg-white/30 hover:scale-105"}`}
//         >
//           <svg className={`w-5 h-5 transition-transform duration-200 ${isLiked ? "scale-110" : "scale-100"}`} fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4.318 6.318a4.5 4.5 0 000 6.364L12
//               20.364l7.682-7.682a4.5 4.5 0
//               00-6.364-6.364L12 7.636l-1.318-1.318a4.5
//               4.5 0 00-6.364 0z"
//             />
//           </svg>
//           <span className="text-sm font-semibold">{likeCount}</span>
//         </button>
//       </div>

//       {/* Keyframe animation */}
//       <style>
//         {`
//           @keyframes pop {
//             0% { transform: scale(0.9); opacity: 0; }
//             60% { transform: scale(1.05); opacity: 1; }
//             100% { transform: scale(1); }
//           }
//           .animate-pop {
//             animation: pop 0.5s ease-out;
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default BlogPostView;

// // In your BlogPostView component

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import BlogLayout from "../../../components/Layouts/BlogLayout/BlogLayout";
// import ModernCommentSection from "../../../components/ModernCommentSection";

// const BlogPostView = () => {
//   const { id } = useParams();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isLiked, setIsLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   const [viewCount, setViewCount] = useState(0);
//   const [isLiking, setIsLiking] = useState(false);

//   // Get the current authenticated user
//   const getCurrentUser = () => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       const user = JSON.parse(userData);
//       return user._id || user.id || user.email; // Use actual user ID from authentication
//     }
//     return null;
//   };

//   // Generate a unique visitor identifier (for non-authenticated users)
//   const getVisitorId = () => {
//     let visitorId = localStorage.getItem("blog_visitorId");
//     if (!visitorId) {
//       visitorId = "visitor_" + Math.random().toString(36).substr(2, 9);
//       localStorage.setItem("blog_visitorId", visitorId);
//     }
//     return visitorId;
//   };

//   // Get the appropriate user identifier
//   const getUserId = () => {
//     const authenticatedUser = getCurrentUser();
//     if (authenticatedUser) {
//       return authenticatedUser; // Use actual user ID for authenticated users
//     }
//     return getVisitorId(); // Use visitor ID for non-authenticated users
//   };

//   // Check if user is authenticated
//   const isAuthenticated = () => {
//     return !!localStorage.getItem("user");
//   };

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         setLoading(true);

//         // Fetch post data
//         const response = await fetch(`http://localhost:5009/api/blogposts/${id}`);
//         if (!response.ok) {
//           throw new Error(`Failed to fetch post: ${response.status}`);
//         }
//         const data = await response.json();
//         setPost(data);
//         setLikeCount(data.likes || 0);
//         setViewCount(data.views || 0);

//         // Check if current user has liked this post
//         const userId = getUserId();
//         console.log("Current user ID:", userId);
//         console.log("Post likedBy:", data.likedBy);

//         // For authenticated users, check the backend likedBy array
//         if (isAuthenticated() && data.likedBy) {
//           setIsLiked(data.likedBy.includes(userId));
//         } else {
//           // For non-authenticated users, check localStorage
//           const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
//           setIsLiked(!!likedPosts[id]);
//         }

//         // Increment view count (only once per session)
//         await incrementViewCount();
//       } catch (error) {
//         console.error("Error fetching post:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPost();
//   }, [id]);

//   const incrementViewCount = async () => {
//     try {
//       // Use a combination of sessionStorage and localStorage to track views more accurately
//       const viewKey = `viewed_${id}`;
//       const sessionViewed = sessionStorage.getItem(viewKey);
//       const permanentViewed = localStorage.getItem(viewKey);

//       // Only increment if user hasn't viewed this post in current session AND hasn't permanently viewed it recently
//       if (!sessionViewed && !permanentViewed) {
//         const response = await fetch(`http://localhost:5009/api/blogposts/${id}/views`, {
//           method: "POST",
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setViewCount(data.views);

//           // Mark as viewed in session (temporary)
//           sessionStorage.setItem(viewKey, "true");
//           // Mark as viewed permanently (lasts 24 hours)
//           localStorage.setItem(viewKey, "true");

//           // Set expiration for permanent marker (24 hours)
//           setTimeout(() => {
//             localStorage.removeItem(viewKey);
//           }, 24 * 60 * 60 * 1000); // 24 hours
//         }
//       } else if (!sessionViewed && permanentViewed) {
//         // User has viewed before but not in this session - just update session
//         sessionStorage.setItem(viewKey, "true");
//       }
//     } catch (error) {
//       console.error("Failed to update view count:", error);
//     }
//   };

//   const handleLike = async () => {
//     if (isLiking) return;

//     try {
//       setIsLiking(true);
//       const userId = getUserId();
//       const authenticated = isAuthenticated();

//       console.log("Like action - User:", userId, "Authenticated:", authenticated);

//       const response = await fetch(`http://localhost:5009/api/blogposts/${id}/toggle-like`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userId }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to update like: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Like response:", data);

//       setLikeCount(data.likes);
//       setIsLiked(data.hasLiked);

//       // For non-authenticated users, also update localStorage
//       if (!authenticated) {
//         const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
//         if (data.hasLiked) {
//           likedPosts[id] = true;
//         } else {
//           delete likedPosts[id];
//         }
//         localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
//       }
//     } catch (error) {
//       console.error("Failed to update like:", error);
//       alert("Failed to update like. Please try again.");
//     } finally {
//       setIsLiking(false);
//     }
//   };

//   if (loading) {
//     return (
//       <BlogLayout>
//         <div className="max-w-4xl mx-auto flex justify-center items-center min-h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         </div>
//       </BlogLayout>
//     );
//   }

//   if (error) {
//     return (
//       <BlogLayout>
//         <div className="max-w-4xl mx-auto text-center py-12">
//           <div className="text-red-500 text-xl mb-4">Error Loading Post</div>
//           <p className="text-gray-600">{error}</p>
//           <button onClick={() => window.location.reload()} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
//             Retry
//           </button>
//         </div>
//       </BlogLayout>
//     );
//   }

//   if (!post) {
//     return (
//       <BlogLayout>
//         <div className="max-w-4xl mx-auto text-center py-12">
//           <p className="text-gray-600">Post not found.</p>
//         </div>
//       </BlogLayout>
//     );
//   }

//   return (
//     <BlogLayout>
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         {/* Blog Post Header */}
//         <article className="mb-12">
//           {/* Blog Post Image */}
//           {post.image && (
//             <div className="mb-8">
//               <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg shadow-md" />
//             </div>
//           )}
//           <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">{post.title}</h1>
//           <div className="text-gray-600 mb-8">
//             <span>By {post.author?.name || "Unknown Author"}</span>
//             <span className="mx-2">•</span>
//             <span>{post.date || new Date(post.createdAt).toLocaleDateString()}</span>
//           </div>
//           <div className="prose prose-lg max-w-none mb-8">{post.content || post.description}</div>
//           <div className="mt-8">
//             {post.tags?.map((tag) => (
//               <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
//                 #{tag}
//               </span>
//             ))}
//           </div>
//         </article>

//         {/* Comments Section */}
//         <section className="border-t border-gray-200 pt-8">
//           <ModernCommentSection />
//         </section>
//       </div>

//       {/* Floating Post Stats */}
//       <FloatingPostStats likeCount={likeCount} viewCount={viewCount} isLiked={isLiked} onLike={handleLike} isLiking={isLiking} />
//     </BlogLayout>
//   );
// };

// // Floating Post Stats Component
// const FloatingPostStats = ({ likeCount, viewCount, isLiked, onLike, isLiking }) => {
//   return (
//     <div className="fixed bottom-6 right-6 z-40">
//       <div className="bg-gradient-to-r from-sky-400 to-cyan-500 text-white backdrop-blur-md rounded-2xl shadow-xl border border-white/20 px-4 py-3 flex items-center gap-4 transition-all duration-300 hover:scale-105 animate-pop-in">
//         {/* View Counter */}
//         <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-xl shadow-inner">
//           <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//           </svg>
//           <span className="text-sm font-semibold">{viewCount}</span>
//         </div>

//         {/* Like Button */}
//         <button
//           onClick={onLike}
//           disabled={isLiking}
//           className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 ease-in-out min-w-[60px] justify-center ${
//             isLiked ? "bg-white text-red-500 shadow-lg scale-105" : "bg-white/20 text-white hover:bg-white/30"
//           } ${isLiking ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
//         >
//           {isLiking ? (
//             <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
//           ) : (
//             <>
//               <svg className={`w-5 h-5 transition-transform duration-200 ${isLiked ? "scale-110" : "scale-100"}`} fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//               </svg>
//               <span className="text-sm font-semibold">{likeCount}</span>
//             </>
//           )}
//         </button>
//       </div>

//       <style jsx>{`
//         @keyframes pop-in {
//           0% {
//             transform: scale(0.8);
//             opacity: 0;
//           }
//           70% {
//             transform: scale(1.05);
//           }
//           100% {
//             transform: scale(1);
//             opacity: 1;
//           }
//         }
//         .animate-pop-in {
//           animation: pop-in 0.4s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default BlogPostView;

// In your BlogPostView component
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogLayout from "../../../components/Layouts/BlogLayout/BlogLayout";
import ModernCommentSection from "../../../components/ModernCommentSection";

const BlogPostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Get the current authenticated user
  const getCurrentUser = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      return user._id || user.id || user.email;
    }
    return null;
  };

  // Generate a unique visitor identifier (for non-authenticated users)
  const getVisitorId = () => {
    let visitorId = localStorage.getItem("blog_visitorId");
    if (!visitorId) {
      visitorId = "visitor_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("blog_visitorId", visitorId);
    }
    return visitorId;
  };

  // Get the appropriate user identifier
  const getUserId = () => {
    const authenticatedUser = getCurrentUser();
    if (authenticatedUser) {
      return authenticatedUser;
    }
    return getVisitorId();
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Redirect to login/register
  const redirectToAuth = () => {
    // Open the auth modal - you'll need to pass setIsAuthModalOpen as prop
    // Alternatively, you can use a context or state management
    // For now, we'll show an alert and suggest implementing modal opening
    // alert("Please login to like and comment on posts");
    // If you have access to setIsAuthModalOpen, uncomment this:
    // setIsAuthModalOpen(true);
    // Or if you want to navigate to a login page:
    // navigate('/login', {
    //   state: {
    //     returnUrl: `/blogposts/${id}`,
    //     message: 'Please login to like and comment on posts'
    //   }
    // });
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        // Fetch post data
        const response = await fetch(`http://localhost:5009/api/blogposts/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.status}`);
        }
        const data = await response.json();
        setPost(data);
        setLikeCount(data.likes || 0);
        setViewCount(data.views || 0);

        // Check if current user has liked this post
        const userId = getUserId();

        if (isAuthenticated() && data.likedBy) {
          setIsLiked(data.likedBy.includes(userId));
        } else {
          // For non-authenticated users, don't show liked state from localStorage
          // This ensures fresh start when not logged in
          setIsLiked(false);
        }

        // Increment view count
        await incrementViewCount();
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const incrementViewCount = async () => {
    try {
      // More accurate view counting using user-specific tracking
      const viewKey = `viewed_${id}_${getUserId()}`;

      if (!localStorage.getItem(viewKey)) {
        const response = await fetch(`http://localhost:5009/api/blogposts/${id}/views`, {
          method: "POST",
        });

        if (response.ok) {
          const data = await response.json();
          setViewCount(data.views);
          localStorage.setItem(viewKey, "true");

          // Set expiration for view marker (24 hours)
          setTimeout(() => {
            localStorage.removeItem(viewKey);
          }, 24 * 60 * 60 * 1000);
        }
      }
    } catch (error) {
      console.error("Failed to update view count:", error);
    }
  };

  const handleLike = async () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      redirectToAuth();
      return;
    }

    if (isLiking) return;

    try {
      setIsLiking(true);
      const userId = getUserId();

      const response = await fetch(`http://localhost:5009/api/blogposts/${id}/toggle-like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        // Check if it's an authentication error
        if (response.status === 401) {
          redirectToAuth();
          return;
        }
        throw new Error(`Failed to update like: ${response.status}`);
      }

      const data = await response.json();

      setLikeCount(data.likes);
      setIsLiked(data.hasLiked);
    } catch (error) {
      console.error("Failed to update like:", error);
      alert("Failed to update like. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  // Handle comment action - redirect if not authenticated
  const handleCommentAction = () => {
    if (!isAuthenticated()) {
      redirectToAuth();
      return;
    }
    // Your existing comment logic here
    console.log("User can comment now");
  };

  // Update your ModernCommentSection to handle authentication
  const EnhancedCommentSection = () => {
    return (
      <div>
        <ModernCommentSection onCommentAction={handleCommentAction} isAuthenticated={isAuthenticated()} />
      </div>
    );
  };

  if (loading) {
    return (
      <BlogLayout>
        <div className="max-w-4xl mx-auto flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </BlogLayout>
    );
  }

  if (error) {
    return (
      <BlogLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="text-red-500 text-xl mb-4">Error Loading Post</div>
          <p className="text-gray-600">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Retry
          </button>
        </div>
      </BlogLayout>
    );
  }

  if (!post) {
    return (
      <BlogLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-600">Post not found.</p>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Blog Post Header */}
        <article className="mb-12">
          {/* Blog Post Image */}
          {post.image && (
            <div className="mb-8">
              <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg shadow-md" />
            </div>
          )}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">{post.title}</h1>
          <div className="text-gray-600 mb-8">
            <span>By {post.author?.name || "Unknown Author"}</span>
            <span className="mx-2">•</span>
            <span>{post.date || new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="prose prose-lg max-w-none mb-8">{post.content || post.description}</div>
          <div className="mt-8">
            {post.tags?.map((tag) => (
              <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* Comments Section */}
        <section className="border-t border-gray-200 pt-8">
          <EnhancedCommentSection />
        </section>
      </div>

      {/* Floating Post Stats */}
      <FloatingPostStats likeCount={likeCount} viewCount={viewCount} isLiked={isLiked} onLike={handleLike} isLiking={isLiking} isAuthenticated={isAuthenticated()} />
    </BlogLayout>
  );
};

// Updated Floating Post Stats Component with Authentication Check
const FloatingPostStats = ({ likeCount, viewCount, isLiked, onLike, isLiking, isAuthenticated }) => {
  const handleLikeClick = () => {
    if (!isAuthenticated) {
      // Show tooltip or message
      alert("Please login to like posts");
      return;
    }
    onLike();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="bg-gradient-to-r from-sky-400 to-cyan-500 text-white backdrop-blur-md rounded-2xl shadow-xl border border-white/20 px-4 py-3 flex items-center gap-4 transition-all duration-300 hover:scale-105 animate-pop-in">
        {/* View Counter */}
        <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-xl shadow-inner">
          <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-sm font-semibold">{viewCount}</span>
        </div>

        {/* Like Button */}
        <button
          onClick={handleLikeClick}
          disabled={isLiking || !isAuthenticated}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 ease-in-out min-w-[60px] justify-center relative group ${
            isLiked ? "bg-white text-red-500 shadow-lg scale-105" : isAuthenticated ? "bg-white/20 text-white hover:bg-white/30 hover:scale-105" : "bg-white/10 text-white/70 cursor-not-allowed"
          } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
          title={!isAuthenticated ? "Please login to like posts" : ""}
        >
          {!isAuthenticated && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Login to like
            </div>
          )}

          {isLiking ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className={`w-5 h-5 transition-transform duration-200 ${isLiked ? "scale-110" : "scale-100"}`} fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-semibold">{likeCount}</span>
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes pop-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          70% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-pop-in {
          animation: pop-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BlogPostView;
