import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BlogLayout from '../../../components/Layouts/BlogLayout/BlogLayout';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ModernCommentSection from '../../../components/ModernCommentSection';

const BlogPostView = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [showSummary, setShowSummary] = useState(false);
    const [summary, setSummary] = useState('');

    // Mock data fetching, replace with actual API calls
    useEffect(() => {
        // Fetch post
        // axios.get(`/api/posts/${id}`).then(response => setPost(response.data));
        setPost({
            id: id,
            title: 'The Ultimate Guide to React Hooks',
            date: 'Oct 8, 2025',
            tags: ['React', 'JavaScript', 'WebDev'],
            imageUrl: 'https://via.placeholder.com/800x400',
            content: `
<p>This is the full content of the blog post about React Hooks. It would contain detailed explanations, code examples, and best practices.</p>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.</p>
<pre><code class="language-js">// Example of useState
const [count, setCount] = useState(0);</code></pre>
<p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.</p>
        `,
        });

    }, [id]);

    const handleSummarize = () => {
        setSummary('This is an AI-generated summary of the blog post. It highlights the key concepts of React Hooks, such as useState, useEffect, and custom hooks, explaining how they contribute to cleaner and more reusable code in React applications.');
        setShowSummary(true);
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <BlogLayout>
            <div className="p-4 relative">
                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{post.title}</h1>

                {/* Post Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-y py-4">
                    <span className="text-sm text-gray-500">Published on {post.date}</span>
                    <div className="flex-grow flex flex-wrap items-center gap-2">
                        {post.tags.map(tag => (
                            <span key={tag} className="bg-sky-100 text-sky-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <button onClick={handleSummarize} className="flex items-center gap-2 bg-gradient-to-r from-sky-400 to-cyan-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm">
                        <SparklesIcon className="w-5 h-5" />
                        Summarize Post
                    </button>
                </div>

                {/* Main Image */}
                <img src={post.imageUrl} alt={post.title} className="w-full rounded-lg mb-6 shadow-lg" />

                {/* Content */}
                <div className="prose max-w-none text-gray-800 leading-7" dangerouslySetInnerHTML={{ __html: post.content }} />

                {/* Share Section */}
                <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Share This Post</h3>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-500 hover:text-blue-600 transition"><FaFacebook size={22} /></button>
                        <button className="text-gray-500 hover:text-sky-500 transition"><FaTwitter size={22} /></button>
                        <button className="text-gray-500 hover:text-blue-700 transition"><FaLinkedin size={22} /></button>
                        <button className="text-gray-500 hover:text-gray-900 transition"><FiLink size={22} /></button>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-8 pt-6 border-t">
                   <ModernCommentSection />
                </div>

                {/* Summary Popup */}
                {showSummary && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full transform transition-all duration-300 scale-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                                    <SparklesIcon className="w-6 h-6 text-sky-500" />
                                    AI Generated Summary
                                </h3>
                                <button onClick={() => setShowSummary(false)} className="text-gray-400 hover:text-gray-700 transition">
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{summary}</p>
                            <button
                                onClick={() => setShowSummary(false)}
                                className="mt-6 w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </BlogLayout>
    );
};

export default BlogPostView;
