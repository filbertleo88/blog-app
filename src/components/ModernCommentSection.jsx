
import React, { useState } from 'react';
import { FaReply } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const initialComments = [
  {
    id: 1,
    user: '@Ben',
    date: new Date('2025-05-21T10:00:00Z'),
    text: 'This is a fantastic post! Really enjoyed reading it.',
    avatar: 'https://i.pravatar.cc/50?img=1',
    replies: [
      {
        id: 11,
        user: '@CurrentUser',
        date: new Date('2025-05-21T11:30:00Z'),
        text: 'Glad you liked it!',
        avatar: 'https://i.pravatar.cc/50?img=7',
        replies: [],
      },
    ],
  },
  {
    id: 2,
    user: '@Jane',
    date: new Date('2025-05-22T14:00:00Z'),
    text: "Great insights. I'm looking forward to more content like this.",
    avatar: 'https://i.pravatar.cc/50?img=2',
    replies: [],
  },
];

const Comment = ({ comment, onAddReply, level = 0 }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleAddReply = () => {
    if (replyText.trim()) {
      onAddReply(comment.id, replyText);
      setReplyText('');
      setIsReplying(false);
    }
  };

  const handleToggleReplying = () => {
    const newIsReplying = !isReplying;
    setIsReplying(newIsReplying);
    if (newIsReplying) {
      setShowReplies(false);
    }
  };

  const handleToggleShowReplies = () => {
    const newShowReplies = !showReplies;
    setShowReplies(newShowReplies);
    if (newShowReplies) {
      setIsReplying(false);
    }
  };

  return (
    <div className={`transition-colors duration-300 mb-3 p-4 rounded-xl shadow-sm hover:bg-gray-50 ${level > 0 ? 'ml-8' : ''}`}>
      <div className="flex items-start space-x-4">
        <img src={comment.avatar} alt={`${comment.user}'s avatar`} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900">{comment.user}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">{formatDistanceToNow(comment.date, { addSuffix: true })}</span>
          </div>
          <p className="text-gray-700 mt-1">{comment.text}</p>
          <div className="flex items-center justify-between mt-4 text-sm">
            {level < 2 && (
              <button onClick={handleToggleReplying} className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors duration-200">
                <FaReply />
                <span>Reply</span>
              </button>
            )}
            {comment.replies.length > 0 && (
              <button onClick={handleToggleShowReplies} className="bg-sky-100 text-sky-700 font-medium py-1 px-3 rounded-full hover:bg-sky-200 transition-colors duration-200 flex items-center">
                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                <IoMdArrowDropdown className={`ml-1 transition-transform duration-300 ${showReplies ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isReplying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 ml-16"
          >
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-400 focus:border-blue-400 transition"
              rows="2"
              placeholder="Add a reply..."
            ></textarea>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setIsReplying(false)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm">
                Cancel
              </button>
              <button onClick={handleAddReply} className="px-4 py-1 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-lg hover:opacity-90 transition text-sm flex items-center gap-2">
                <FaReply />
                Reply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4 pt-4 border-t border-gray-200"
          >
            {comment.replies.map((reply) => (
              <Comment key={reply.id} comment={reply} onAddReply={onAddReply} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ModernCommentSection = () => {
  const [comments, setComments] = useState(initialComments);
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  const addReplyToComment = (comments, parentId, newReply) => {
    return comments.map(comment => {
      if (comment.id === parentId) {
        return { ...comment, replies: [newReply, ...comment.replies] };
      }
      if (comment.replies.length > 0) {
        return { ...comment, replies: addReplyToComment(comment.replies, parentId, newReply) };
      }
      return comment;
    });
  };

  const handleAddReply = (parentId, text) => {
    if (text.trim() === '') return;

    const newReply = {
      id: Date.now(),
      user: '@CurrentUser',
      date: new Date(),
      text,
      avatar: 'https://i.pravatar.cc/50?img=7',
      replies: [],
    };
    const updatedComments = addReplyToComment(comments, parentId, newReply);
    setComments(updatedComments);
  };

  const handleAddComment = () => {
    if (newComment.trim() === '') return;

    const newCommentData = {
      id: Date.now(),
      user: '@CurrentUser',
      date: new Date(),
      text: newComment,
      avatar: 'https://i.pravatar.cc/50?img=7',
      replies: [],
    };
    setComments([newCommentData, ...comments]);
    setNewComment('');
    setIsCommentBoxOpen(false);
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Comments</h2>
        <button
          onClick={() => setIsCommentBoxOpen(true)}
          className="bg-gradient-to-r from-[#2193b0] to-[#6dd5ed] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
        >
          Add Comment
        </button>
      </div>

      <AnimatePresence>
        {isCommentBoxOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-400 focus:border-blue-400 transition"
              rows="3"
              placeholder="Write a comment..."
            ></textarea>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setIsCommentBoxOpen(false)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm">
                Cancel
              </button>
              <button onClick={handleAddComment} className="px-3 py-1 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition text-sm">
                Post Comment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} onAddReply={handleAddReply} />
        ))}
      </div>
    </div>
  );
};

export default ModernCommentSection;
