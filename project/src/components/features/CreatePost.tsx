import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CalendarIcon, Globe, Lock, Users } from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';
import MediaUploader, { MediaFile } from '@/components/ui/media-uploader';
import { webSocketService } from '@/lib/websocket';
import { simulateNewPost } from './PostFeed';
import { useAuth } from '@/hooks/useAuth';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type VisibilityOption = 'public' | 'friends' | 'group' | 'private';

const visibilityOptions: Record<VisibilityOption, { label: string; icon: React.ReactNode }> = {
  'public': { 
    label: 'Everyone', 
    icon: <Globe className="w-4 h-4 mr-2" />
  },
  'friends': { 
    label: 'Friends only', 
    icon: <Users className="w-4 h-4 mr-2" />
  },
  'group': { 
    label: 'Specific group', 
    icon: <Users className="w-4 h-4 mr-2" />
  },
  'private': { 
    label: 'Only me', 
    icon: <Lock className="w-4 h-4 mr-2" />
  }
};

export interface CreatePostProps {
  onPostCreated?: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<VisibilityOption>('public');
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showAnimations, setShowAnimations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, profile } = useAuth();

  // Handle typing indicator
  useEffect(() => {
    const handleTypingEvent = (data: { userId: string; username: string; isTyping: boolean }) => {
      if (data.isTyping) {
        setTypingUsers(prev => {
          if (!prev.includes(data.username)) {
            return [...prev, data.username];
          }
          return prev;
        });
      } else {
        setTypingUsers(prev => prev.filter(user => user !== data.username));
      }
    };

    // Subscribe to typing events from other users
    webSocketService.subscribe('typing', handleTypingEvent);

    return () => {
      webSocketService.unsubscribe('typing', handleTypingEvent);
    };
  }, []);

  // Notify others when user is typing
  useEffect(() => {
    if (content && !isTyping) {
      setIsTyping(true);
      webSocketService.sendTyping(true);
    }
    
    const timer = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        webSocketService.sendTyping(false);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [content, isTyping]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleMediaChange = (files: MediaFile[]) => {
    setMedia(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && media.length === 0) return;
    
    try {
      setIsSubmitting(true);
      
      // Prepare media files for storage
      const mediaFiles = media.map((file, index) => ({
        id: `media-${Date.now()}-${index}`,
        type: file.type,
        url: file.previewUrl
      }));
      
      // Create the post directly with current user info
      const newPost = {
        content: content,
        author: {
          id: user?.uid || 'anonymous',
          name: profile?.fullName || user?.displayName || 'Anonymous User',
          avatar: user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'anonymous'}`
        },
        createdAt: Timestamp.now(),
        likes: 0,
        comments: [],
        shares: 0,
        media: mediaFiles,
        type: 'community', // Default to community posts
        userReaction: null,
        isSaved: false,
        visibility: visibility,
        seenBy: []
      };
      
      // Save directly to Firestore
      console.log('Adding post to Firestore...');
      const docRef = await addDoc(collection(db, 'posts'), newPost);
      console.log('Post added with ID:', docRef.id);
      
      // Reset form
      setContent('');
      setMedia([]);
      setVisibility('public');
      setScheduledDate(null);
      setShowScheduler(false);
      
      // If scheduled, show confirmation
      if (scheduledDate) {
        alert(`Post scheduled for ${scheduledDate.toLocaleString()}`);
      }
      
      // Call the onPostCreated callback if provided
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('There was an error creating your post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      setScheduledDate(new Date(dateValue));
    } else {
      setScheduledDate(null);
    }
  };

  return (
    <Card className={`overflow-hidden ${showAnimations ? 'transition-all duration-300 ease-in-out' : ''}`}>
      <CardHeader>
        <CardTitle>Create Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <RichTextEditor
            value={content}
            onChange={handleContentChange}
            onTypingChange={(typing) => {
              setIsTyping(typing);
              webSocketService.sendTyping(typing);
            }}
            placeholder="What's on your mind?"
            minHeight="100px"
          />

          {typingUsers.length > 0 && (
            <div className="text-xs text-gray-500 italic">
              {typingUsers.length === 1 
                ? `${typingUsers[0]} is typing...` 
                : `${typingUsers.length} people are typing...`}
            </div>
          )}
          
          <MediaUploader
            onMediaChange={handleMediaChange}
            maxFiles={4}
          />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    {visibility === 'public' ? (
                      <Globe className="w-3 h-3" />
                    ) : visibility === 'friends' ? (
                      <Users className="w-3 h-3" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                    {visibility === 'public' ? 'Public' : 
                     visibility === 'friends' ? 'Friends' : 
                     visibility === 'group' ? 'Group' : 'Private'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setVisibility('public')}>
                    <Globe className="w-4 h-4 mr-2" />
                    Public
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setVisibility('friends')}>
                    <Users className="w-4 h-4 mr-2" />
                    Friends
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setVisibility('private')}>
                    <Lock className="w-4 h-4 mr-2" />
                    Private
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                type="button"
                onClick={() => setShowScheduler(!showScheduler)}
              >
                <CalendarIcon className="w-3 h-3 mr-1" />
                Schedule
              </Button>
            </div>
            
            <Button 
              type="submit" 
              size="sm" 
              disabled={(!content.trim() && media.length === 0) || (showScheduler && !scheduledDate) || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </div>
              ) : (
                scheduledDate ? 'Schedule Post' : 'Post Now'
              )}
            </Button>
          </div>
          
          {showScheduler && (
            <div className="mt-2">
              <Input
                type="datetime-local"
                value={scheduledDate ? scheduledDate.toISOString().slice(0, 16) : ''}
                onChange={handleScheduleChange}
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-xs text-gray-500 mt-1">
                {scheduledDate ? `Post will be published on ${scheduledDate.toLocaleString()}` : 'Select a date and time to schedule your post'}
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}