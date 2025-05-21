import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, MessageSquare, Share2, Heart, Smile, Bookmark, Users, Copy, ExternalLink } from 'lucide-react';
import { Button } from './button';

// Reaction types
export type ReactionType = 'like' | 'love' | 'support' | 'celebrate' | 'laugh';

interface Reaction {
  type: ReactionType;
  icon: React.ReactNode;
  label: string;
  color: string;
}

const reactions: Record<ReactionType, Reaction> = {
  'like': {
    type: 'like',
    icon: <ThumbsUp className="w-4 h-4" />,
    label: 'Like',
    color: 'text-blue-500'
  },
  'love': {
    type: 'love',
    icon: <Heart className="w-4 h-4" />,
    label: 'Love',
    color: 'text-red-500'
  },
  'support': {
    type: 'support',
    icon: <span className="text-yellow-500">👍</span>,
    label: 'Support',
    color: 'text-yellow-500'
  },
  'celebrate': {
    type: 'celebrate',
    icon: <span className="text-green-500">🎉</span>,
    label: 'Celebrate',
    color: 'text-green-500'
  },
  'laugh': {
    type: 'laugh',
    icon: <Smile className="w-4 h-4" />,
    label: 'Laugh',
    color: 'text-orange-500'
  }
};

export interface PostInteractionsProps {
  postId: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  onReaction: (postId: string, reactionType: ReactionType) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string, method: 'public' | 'private' | 'group' | 'external' | 'copy') => void;
  onSave: (postId: string, saved: boolean) => void;
  userReaction?: ReactionType | null;
  isSaved?: boolean;
}

export function PostInteractions({
  postId,
  likeCount,
  commentCount,
  shareCount,
  onReaction,
  onComment,
  onShare,
  onSave,
  userReaction = null,
  isSaved = false
}: PostInteractionsProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const reactionsRef = useRef<HTMLDivElement>(null);
  const shareOptionsRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside of reaction menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reactionsRef.current && !reactionsRef.current.contains(event.target as Node)) {
        setShowReactions(false);
      }
      if (shareOptionsRef.current && !shareOptionsRef.current.contains(event.target as Node)) {
        setShowShareOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleReactionClick = (reactionType: ReactionType) => {
    onReaction(postId, reactionType);
    setShowReactions(false);
  };

  const handleShareClick = (method: 'public' | 'private' | 'group' | 'external' | 'copy') => {
    onShare(postId, method);
    setShowShareOptions(false);
  };

  // Get the current reaction or default to like
  const currentReaction = userReaction ? reactions[userReaction] : reactions.like;

  return (
    <div className="flex items-center justify-between border-t pt-3 mt-3">
      <div className="flex items-center">
        {/* Reactions button */}
        <div className="relative" ref={reactionsRef}>
          <Button
            variant="ghost"
            size="sm"
            className={userReaction ? currentReaction.color : ''}
            onClick={() => userReaction ? onReaction(postId, userReaction) : setShowReactions(!showReactions)}
            onMouseEnter={() => setShowReactions(true)}
          >
            {userReaction ? currentReaction.icon : <ThumbsUp className="w-4 h-4 mr-2" />}
            {likeCount > 0 && (<span>{likeCount}</span>)}
          </Button>
          
          {/* Reactions menu */}
          {showReactions && (
            <div 
              className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border p-1 flex space-x-1 z-10"
              onMouseLeave={() => setShowReactions(false)}
            >
              {Object.values(reactions).map(reaction => (
                <button
                  key={reaction.type}
                  className={`p-2 rounded-full hover:bg-gray-100 ${
                    userReaction === reaction.type ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleReactionClick(reaction.type)}
                  title={reaction.label}
                >
                  {reaction.icon}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Comment button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onComment(postId)}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {commentCount > 0 && <span>{commentCount}</span>}
        </Button>
        
        {/* Share button */}
        <div className="relative" ref={shareOptionsRef}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowShareOptions(!showShareOptions)}
          >
            <Share2 className="w-4 h-4 mr-2" />
            {shareCount > 0 && <span>{shareCount}</span>}
          </Button>
          
          {/* Share options menu */}
          {showShareOptions && (
            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-md shadow-lg border p-1 z-10 w-48">
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center"
                onClick={() => handleShareClick('public')}
              >
                <Users className="w-4 h-4 mr-2" />
                Share publicly
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center"
                onClick={() => handleShareClick('group')}
              >
                <Users className="w-4 h-4 mr-2" />
                Share to a group
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center"
                onClick={() => handleShareClick('private')}
              >
                <Users className="w-4 h-4 mr-2" />
                Share as message
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center"
                onClick={() => handleShareClick('external')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Share externally
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center"
                onClick={() => handleShareClick('copy')}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy link
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Save/Bookmark button */}
      <Button
        variant="ghost"
        size="sm"
        className={isSaved ? 'text-purple-500' : ''}
        onClick={() => onSave(postId, !isSaved)}
      >
        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
      </Button>
    </div>
  );
}

export default PostInteractions; 