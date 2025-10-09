
import React, { useState } from 'react';
import { FaReply } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';

const commentsData = [
  {
    id: 1,
    user: '@Ben',
    date: '21st May 2025',
    text: 'This is a fantastic post! Really enjoyed reading it.',
    avatar: 'https://i.pravatar.cc/50?img=1',
    replies: [
      {
        id: 11,
        user: '@CurrentUser',
        date: '21st May 2025',
        text: 'Glad you liked it!',
        avatar: 'https://i.pravatar.cc/50?img=7',
      }
    ],
  },
  {
    id: 2,
    user: '@Jane',
    date: '22nd May 2025',
    text: "Great insights. I'm looking forward to more content like this.",
    avatar: 'https://i.pravatar.cc/50?img=2',
    replies: [],
  },
  {
    id: 3,
    user: '@Sam',
    date: '23rd May 2025',
    text: 'Could you elaborate on the third point? I have a few questions.',
    avatar: 'https://i.pravatar.cc/50?img=3',
    replies: [],
  },
];

const ModernCommentSection = () => {
  const [comments, setComments] = useState(commentsData);
  const [openReplies, setOpenReplies] = useState({});
  const [replyBox, setReplyBox] = useState(null);
  const [newReply, setNewReply] = useState('');

  const handleToggleReplies = (commentId) => {
    setOpenReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleReplyClick = (commentId) => {
    setReplyBox(replyBox === commentId ? null : commentId);
  };

  const handleAddReply = (commentId) => {
    if (newReply.trim()) {
      const newReplyData = {
        id: Date.now(),
        user: '@CurrentUser',
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        text: newReply,
        avatar: 'https://i.pravatar.cc/50?img=7',
      };
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, replies: [...comment.replies, newReplyData] };
        }
        return comment;
      });
      setComments(updatedComments);
      setNewReply('');
      setReplyBox(null);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Comments</h2>
        <button className="bg-gradient-to-r from-sky-400 to-cyan-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
          Add Comment
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded-xl shadow-sm">
            <div className="flex items-start space-x-4">
              <img
                src={comment.avatar}
                alt={`${comment.user}'s avatar`}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">{comment.user}</span>
                  <span className="text-gray-500 text-sm">·</span>
                  <span className="text-gray-500 text-sm">{comment.date}</span>
                </div>
                <p className="text-gray-700 mt-1">{comment.text}</p>
                <div className="flex items-center space-x-4 mt-4 text-sm">
                  <button onClick={() => handleReplyClick(comment.id)} className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors duration-200">
                    <FaReply />
                    <span>Reply</span>
                  </button>
                  {comment.replies.length >= 0 && (
                    <button onClick={() => handleToggleReplies(comment.id)} className="bg-sky-100 text-sky-700 font-medium py-1 px-3 rounded-full hover:bg-sky-200 transition-colors duration-200 flex items-center">
                      {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                      <IoMdArrowDropdown className={`ml-1 transition-transform ${openReplies[comment.id] ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Inline Reply Box */}
                {replyBox === comment.id && (
                  <div className="mt-4">
                    <textarea
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500 transition"
                      rows="2"
                      placeholder="Write a reply..."
                    ></textarea>
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setReplyBox(null)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm">
                        Cancel
                      </button>
                      <button onClick={() => handleAddReply(comment.id)} className="px-3 py-1 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition text-sm">
                        Send
                      </button>
                    </div>
                  </div>
                )}

                {/* Replies Section */}
                {openReplies[comment.id] && (
                  <div className="mt-4 ml-12 space-y-4 transition-all duration-500">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3 bg-white border rounded-lg p-3">
                        <img
                          src={reply.avatar}
                          alt={reply.user}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">{reply.user}</span>
                            <span className="text-xs text-gray-400">· {reply.date}</span>
                          </div>
                          <p className="text-gray-700">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModernCommentSection;
