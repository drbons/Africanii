import React, { useState } from 'react';
import { ChevronDown, ThumbsUp, Reply, MoreVertical, ArrowDown, Clock, Filter } from 'lucide-react';
import { Button } from './button';
import { Textarea } from './textarea';
import { Avatar } from './avatar';

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

type SortOption = 'newest' | 'oldest' | 'relevance';

export interface CommentThreadProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, content: string, parentId?: string) => void;
  onLikeComment: (commentId: string, liked: boolean) => void;
}

export function CommentThread({ postId, comments, onAddComment, onLikeComment }: CommentThreadProps) {
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(postId, newComment);
      setNewComment('');
    }
  };

  const handleAddReply = (parentId: string) => {
    if (replyContent.trim()) {
      onAddComment(postId, replyContent, parentId);
      setReplyContent('');
      setReplyToId(null);
    }
  };

  const toggleReply = (commentId: string) => {
    setReplyToId(replyToId === commentId ? null : commentId);
    setReplyContent('');
  };

  const toggleExpanded = (commentId: string) => {
    const updated = new Set(expandedComments);
    if (updated.has(commentId)) {
      updated.delete(commentId);
    } else {
      updated.add(commentId);
    }
    setExpandedComments(updated);
  };

  const setSorting = (option: SortOption) => {
    setSortBy(option);
    setShowSortOptions(false);
  };

  // Sort comments based on the selected option
  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'oldest':
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case 'relevance':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const renderComment = (comment: Comment, isReply = false) => (
    <div 
      key={comment.id} 
      className={`flex space-x-3 ${isReply ? 'mt-3 pl-8' : 'mt-4'}`}
    >
      <Avatar className="w-8 h-8">
        <img src={comment.author.avatar} alt={comment.author.name} />
      </Avatar>
      <div className="flex-1">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="font-medium">{comment.author.name}</div>
          <p className="text-sm mt-1">{comment.content}</p>
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
          <span>{comment.timestamp}</span>
          <button 
            className={`flex items-center hover:text-gray-700 ${comment.isLiked ? 'text-blue-500' : ''}`} 
            onClick={() => onLikeComment(comment.id, !comment.isLiked)}
          >
            <ThumbsUp className="w-3 h-3 mr-1" />
            {comment.likes > 0 && <span>{comment.likes}</span>}
          </button>
          <button 
            className="hover:text-gray-700"
            onClick={() => toggleReply(comment.id)}
          >
            <Reply className="w-3 h-3 mr-1 inline" />
            Reply
          </button>
        </div>
        
        {comment.replies && comment.replies.length > 0 && (
          <>
            <button 
              className="text-xs text-blue-500 mt-1 flex items-center"
              onClick={() => toggleExpanded(comment.id)}
            >
              <ChevronDown 
                className={`w-3 h-3 mr-1 transition-transform ${
                  expandedComments.has(comment.id) ? 'rotate-180' : ''
                }`} 
              />
              {expandedComments.has(comment.id) 
                ? 'Hide replies' 
                : `Show ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`
              }
            </button>
            
            {expandedComments.has(comment.id) && (
              <div className="mt-1">
                {comment.replies.map(reply => renderComment(reply, true))}
              </div>
            )}
          </>
        )}
        
        {replyToId === comment.id && (
          <div className="mt-2 flex space-x-2">
            <Avatar className="w-6 h-6">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Me" alt="Me" />
            </Avatar>
            <div className="flex-1">
              <Textarea 
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="text-sm min-h-[60px] resize-none"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setReplyToId(null)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={() => handleAddReply(comment.id)}
                  disabled={!replyContent.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs flex items-center"
            onClick={() => setShowSortOptions(!showSortOptions)}
          >
            <Filter className="w-3 h-3 mr-1" />
            Sort by: {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : 'Relevance'}
          </Button>
          
          {showSortOptions && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg border z-10">
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center"
                onClick={() => setSorting('newest')}
              >
                <ArrowDown className="w-3 h-3 mr-2 rotate-180" />
                Newest
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center"
                onClick={() => setSorting('oldest')}
              >
                <Clock className="w-3 h-3 mr-2" />
                Oldest
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center"
                onClick={() => setSorting('relevance')}
              >
                <ThumbsUp className="w-3 h-3 mr-2" />
                Most relevant
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Add comment form */}
      <div className="flex space-x-3">
        <Avatar className="w-8 h-8">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Me" alt="Me" />
        </Avatar>
        <form className="flex-1" onSubmit={handleAddComment}>
          <Textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="min-h-[80px] resize-none"
          />
          <div className="flex justify-end mt-2">
            <Button 
              type="submit" 
              size="sm" 
              disabled={!newComment.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              Comment
            </Button>
          </div>
        </form>
      </div>
      
      {/* Comments list */}
      <div className="mt-4">
        {sortedComments.map(comment => renderComment(comment))}
      </div>
    </div>
  );
}

export default CommentThread; 