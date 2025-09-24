import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useAuth } from './AuthContext';
import AuthModal from './AuthModal';

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies?: Comment[];
  isLiked?: boolean;
  isAuthor?: boolean;
}

interface CommentSystemProps {
  contentId: string;
  contentType: string;
  className?: string;
  postTitle?: string;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string, content: string) => void;
  onLike: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  isReply?: boolean;
}

// 模拟评论数据
const mockComments: Comment[] = [
  {
    id: '1',
    author: 'EV Enthusiast',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar%20portrait%20business%20person&image_size=square',
    content: 'Great analysis! The data clearly shows the rapid growth of Chinese EV market. I\'m particularly interested in the market share trends.',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        author: 'Market Analyst',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20analyst%20avatar%20business%20portrait&image_size=square',
        content: 'Absolutely! The Q4 2023 data is especially impressive. BYD and Tesla are really dominating the market.',
        timestamp: new Date('2024-01-15T11:15:00Z'),
        likes: 5,
        isLiked: true
      }
    ]
  },
  {
    id: '2',
    author: 'Tech Reviewer',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=tech%20reviewer%20avatar%20modern%20professional&image_size=square',
    content: 'The autonomous driving features comparison is very insightful. XPeng\'s NGP system seems to be advancing rapidly.',
    timestamp: new Date('2024-01-14T16:45:00Z'),
    likes: 8,
    isLiked: false,
    replies: []
  },
  {
    id: '3',
    author: 'Industry Expert',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=industry%20expert%20professional%20avatar%20business&image_size=square',
    content: 'Would love to see more detailed analysis on the charging infrastructure development. That\'s going to be crucial for the next phase of EV adoption.',
    timestamp: new Date('2024-01-13T14:20:00Z'),
    likes: 15,
    isLiked: true,
    replies: [
      {
        id: '3-1',
        author: 'Infrastructure Analyst',
        content: 'Totally agree! The charging network expansion is happening at an unprecedented pace in China.',
        timestamp: new Date('2024-01-13T15:30:00Z'),
        likes: 3,
        isLiked: false
      }
    ]
  }
];

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  onReply, 
  onLike, 
  onDelete, 
  isReply = false 
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className={`${isReply ? 'ml-8 mt-4' : 'mb-6'}`}>
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.avatar ? (
            <img
              src={comment.avatar}
              alt={comment.author}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
              {getInitials(comment.author)}
            </div>
          )}
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-gray-900">
                {comment.author}
                {comment.isAuthor && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Author
                  </span>
                )}
              </h4>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(comment.timestamp, { addSuffix: true, locale: zhCN })}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {comment.content}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200 ${
                comment.isLiked ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <svg className="w-4 h-4" fill={comment.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{comment.likes}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                Reply
              </button>
            )}

            {comment.isAuthor && onDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-gray-500 hover:text-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <form onSubmit={handleReplySubmit} className="mt-3">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium">
                    U
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReplyForm(false);
                        setReplyContent('');
                      }}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!replyContent.trim() || isSubmitting}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isSubmitting ? 'Posting...' : 'Reply'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onLike={onLike}
                  onDelete={onDelete}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentSystem: React.FC<CommentSystemProps> = ({ 
  contentId, 
  contentType, 
  className = '',
  postTitle
}) => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  
  const { user, isAuthenticated } = useAuth();

  // 排序评论
  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.timestamp.getTime() - a.timestamp.getTime();
      case 'oldest':
        return a.timestamp.getTime() - b.timestamp.getTime();
      case 'popular':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    setIsSubmitting(true);
    try {
      const comment: Comment = {
        id: Date.now().toString(),
        author: user?.name || 'Anonymous',
        content: newComment,
        timestamp: new Date(),
        likes: 0,
        isLiked: false,
        isAuthor: true,
        replies: []
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (commentId: string, content: string) => {
    if (!isAuthenticated) return;
    
    const reply: Comment = {
      id: `${commentId}-${Date.now()}`,
      author: user?.name || 'Anonymous',
      content,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      isAuthor: true
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    }));
  };

  const handleLike = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      
      // Check replies
      if (comment.replies) {
        const updatedReplies = comment.replies.map(reply => {
          if (reply.id === commentId) {
            return {
              ...reply,
              isLiked: !reply.isLiked,
              likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
            };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      
      return comment;
    }));
  };

  const handleDelete = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Comments ({comments.length})
            </h3>
            {postTitle && (
              <p className="text-sm text-gray-600 mt-1">
                on "{postTitle}"
              </p>
            )}
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <label htmlFor="comment-sort" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="comment-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-gray-500">
                    Be respectful and constructive in your comments.
                  </p>
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              Please log in to join the discussion.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setAuthModalMode('register'); setIsAuthModalOpen(true); }}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {sortedComments.length > 0 ? (
            sortedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onLike={handleLike}
                onDelete={comment.isAuthor ? handleDelete : undefined}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.681L3 21l2.319-5.094A7.96 7.96 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
              <p className="text-gray-500">
                Be the first to share your thoughts on this post.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
};

export default CommentSystem;
export type { Comment, CommentSystemProps };