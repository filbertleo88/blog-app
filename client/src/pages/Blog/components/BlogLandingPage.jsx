import React, { useState, useEffect } from "react";
import BlogPostCard from "./BlogPostCard";
import BlogLayout from "../../../components/Layouts/BlogLayout/BlogLayout";
import API_BASE_URL from "../../../config/api";

const BlogLandingPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visiblePosts, setVisiblePosts] = useState(4);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);

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

    // Fallback to createdAt or very old date
    return new Date(0);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/blogposts`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log(
          "Raw posts:",
          data.map((p) => ({ title: p.title, date: p.date, status: p.status }))
        ); // Debug

        // Filter only published posts
        const publishedPosts = data.filter((post) => post.status === "published");

        console.log(
          "Published posts:",
          publishedPosts.map((p) => ({ title: p.title, date: p.date, status: p.status }))
        ); // Debug

        // Sort published posts by date (newest first) using the custom parser
        const sortedPosts = publishedPosts.sort((a, b) => {
          const dateA = parseDate(a.date);
          const dateB = parseDate(b.date);
          return dateB - dateA; // Newest first
        });

        console.log(
          "Sorted published posts:",
          sortedPosts.map((p) => ({ title: p.title, date: p.date }))
        ); // Debug

        setPosts(sortedPosts);

        // Check if all posts are already visible
        if (sortedPosts.length <= 4) {
          setAllPostsLoaded(true);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const loadMorePosts = () => {
    const newVisibleCount = visiblePosts + 4;
    setVisiblePosts(newVisibleCount);

    // Check if we've reached the end
    if (newVisibleCount >= posts.length) {
      setAllPostsLoaded(true);
    }
  };

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
            <h2 className="text-red-800 font-semibold mb-2">Error Loading Posts</h2>
            <p className="text-red-600">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
              Try Again
            </button>
          </div>
        </div>
      </BlogLayout>
    );
  }

  const visiblePostsList = posts.slice(0, visiblePosts);

  return (
    <BlogLayout>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Latest Blog Posts</h1>
          <p className="text-gray-600">
            Discover the latest insights and tutorials on web development
            {posts.length > 0 && ` (${posts.length} published posts)`}
          </p>
        </div>

        {visiblePostsList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {visiblePostsList.map((post, index) => (
                <div key={post._id || post.id} className="relative">
                  {index === 0 && posts.length > 1 && <div className="absolute -top-2 -left-2 bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded z-10">LATEST</div>}
                  <BlogPostCard post={post} />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {!allPostsLoaded && posts.length > 4 && (
              <div className="text-center">
                <button
                  onClick={loadMorePosts}
                  className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Load More Posts ({posts.length - visiblePosts} remaining)
                </button>
                <p className="text-gray-500 text-sm mt-2">
                  Showing {visiblePosts} of {posts.length} published posts
                </p>
              </div>
            )}

            {/* All posts loaded message */}
            {allPostsLoaded && posts.length > 4 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">🎉 You've seen all {posts.length} published posts!</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg mb-2">No published blog posts yet.</p>
            <p className="text-gray-400">Check back later for new content!</p>
          </div>
        )}
      </div>
    </BlogLayout>
  );
};

export default BlogLandingPage;
