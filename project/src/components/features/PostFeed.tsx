import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ThumbsUp, MessageSquare, Share2, Send, EyeIcon, Users, Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PostInteractions, { ReactionType } from '@/components/ui/post-interactions';
import CommentThread, { Comment } from '@/components/ui/comment-thread';
import { webSocketService } from '@/lib/websocket';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, addDoc, collection, getDoc, getDocs, query, orderBy, limit, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { usePostContext } from '@/hooks/usePostContext';

interface PostAuthor {
  id: string;
  name: string;
  avatar: string;
}

interface PostMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
}

interface Post {
  id: string;
  content: string;
  author: PostAuthor;
  timestamp: string;
  likes: number;
  comments: Comment[];
  shares: number;
  media?: PostMedia[];
  type: 'community' | 'personal';
  userReaction?: ReactionType | null;
  isSaved?: boolean;
  visibility: 'public' | 'friends' | 'group' | 'private';
  seenBy?: PostAuthor[];
  isNew?: boolean;
}

// Sample data
const samplePosts: Post[] = [
  {
    id: '1',
    content: 'Just launched my new African cuisine restaurant in Atlanta!',
    author: {
      id: 'user1',
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    timestamp: '2 hours ago',
    likes: 24,
    comments: [
      {
        id: 'comment1',
        author: {
          id: 'user2',
          name: 'Sarah Smith',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
        },
        content: 'Congratulations! Looking forward to trying it out.',
        timestamp: '1 hour ago',
        likes: 5,
        isLiked: false
      },
      {
        id: 'comment2',
        author: {
          id: 'user3',
          name: 'Michael Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
        },
        content: 'What\'s your signature dish?',
        timestamp: '30 minutes ago',
        likes: 2,
        isLiked: true,
        replies: [
          {
            id: 'reply1',
            author: {
              id: 'user1',
              name: 'John Doe',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
            },
            content: 'Our signature dish is Jollof Rice with grilled tilapia!',
            timestamp: '25 minutes ago',
            likes: 3,
            isLiked: false
          }
        ]
      }
    ],
    shares: 3,
    media: [
      {
        id: 'media1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1605349924752-4d9d7aa96198?q=80&w=1974&auto=format&fit=crop'
      }
    ],
    type: 'community',
    userReaction: null,
    isSaved: false,
    visibility: 'public',
    seenBy: [
      {
        id: 'user2',
        name: 'Sarah Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
      },
      {
        id: 'user3',
        name: 'Michael Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
      }
    ]
  },
  {
    id: '2',
    content: 'Looking for African fabric suppliers in Houston area. Any recommendations?',
    author: {
      id: 'user2',
      name: 'Sarah Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    timestamp: '4 hours ago',
    likes: 15,
    comments: [],
    shares: 2,
    type: 'personal',
    userReaction: 'like',
    isSaved: true,
    visibility: 'friends'
  },
  {
    id: '3',
    content: 'Excited to announce our new African art gallery opening next month in Chicago!',
    author: {
      id: 'user3',
      name: 'Michael Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
    },
    timestamp: '6 hours ago',
    likes: 32,
    comments: [],
    shares: 8,
    media: [
      {
        id: 'media2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?q=80&w=2070&auto=format&fit=crop'
      },
      {
        id: 'media3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1574236170880-141bc3760d9c?q=80&w=2071&auto=format&fit=crop'
      }
    ],
    type: 'community',
    userReaction: 'celebrate',
    isSaved: false,
    visibility: 'public'
  }
];

interface PostFeedProps {
  type: 'community' | 'personal';
}

export default function PostFeed({ type }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newPosts, setNewPosts] = useState<Post[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch posts from Firestore and set up a real-time listener
  useEffect(() => {
    setLoading(true);
    console.log('Setting up posts listener...');
    
    // Create a query to get posts ordered by timestamp
    const postsCollection = collection(db, 'posts');
    const postsQuery = query(
      postsCollection,
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    // Set up a real-time listener
    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        console.log(`Got ${snapshot.size} posts from Firestore`);
        
        const fetchedPosts: Post[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          
          fetchedPosts.push({
            id: doc.id,
            content: data.content || '',
            author: {
              id: data.author?.id || 'unknown',
              name: data.author?.name || 'Unknown User',
              avatar: data.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`
            },
            timestamp: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleString() : 'Recently',
            likes: data.likes || 0,
            comments: data.comments || [],
            shares: data.shares || 0,
            media: data.media || [],
            type: data.type || 'community',
            userReaction: data.userReaction || null,
            isSaved: data.isSaved || false,
            visibility: data.visibility || 'public',
            seenBy: data.seenBy || []
          });
        });
        
        // Filter posts by type if requested, otherwise show all
        const filteredPosts = type 
          ? fetchedPosts.filter(post => post.type === type || type === 'community')
          : fetchedPosts;
          
        console.log(`Setting ${filteredPosts.length} filtered posts`);
        
        // If no posts were found in Firestore, use the sample data
        if (filteredPosts.length === 0) {
          console.log('No posts found in Firestore, using sample data');
          
          // Filter sample posts by type
          const sampleFiltered = type 
            ? samplePosts.filter(post => post.type === type)
            : samplePosts;
            
          setPosts(sampleFiltered);
        } else {
          setPosts(filteredPosts);
        }
        
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching posts:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch posts');
        
        // On error, fall back to sample data
        console.log('Error fetching from Firestore, using sample data');
        const sampleFiltered = type 
          ? samplePosts.filter(post => post.type === type)
          : samplePosts;
          
        setPosts(sampleFiltered);
        setLoading(false);
      }
    );
    
    // Clean up the listener
    return () => unsubscribe();
  }, [type]);

  // Listen for new posts via WebSocket
  useEffect(() => {
    const handleNewPost = (data: Post) => {
      if (data.type === type) {
        // Add animation flag to new posts
        setNewPosts(prev => [{ ...data, isNew: true }, ...prev]);
      }
    };

    webSocketService.subscribe('new_post', handleNewPost);

    return () => {
      webSocketService.unsubscribe('new_post', handleNewPost);
    };
  }, [type]);

  // Merge new posts into main feed after a delay
  useEffect(() => {
    if (newPosts.length > 0) {
      const timer = setTimeout(() => {
        setPosts(prev => [...newPosts, ...prev]);
        setNewPosts([]);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [newPosts]);

  // Set up a real-time Firestore listener
  useEffect(() => {
    const postsCollection = collection(db, 'posts');
    const postsQuery = query(
      postsCollection,
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    // This function will run whenever a new post is added to Firestore
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          const newPost: Post = {
            id: change.doc.id,
            content: data.content,
            author: data.author,
            timestamp: data.timestamp || 'Recently',
            likes: data.likes || 0,
            comments: data.comments || [],
            shares: data.shares || 0,
            media: data.media || [],
            type: data.type,
            userReaction: data.userReaction || null,
            isSaved: data.isSaved || false,
            visibility: data.visibility || 'public',
            seenBy: data.seenBy || [],
            isNew: true
          };

          // Only add if it's not already in our posts list
          if (!posts.some(post => post.id === newPost.id) && 
              !newPosts.some(post => post.id === newPost.id)) {
            if (newPost.type === type) {
              setNewPosts(prev => [newPost, ...prev]);
            }
          }
        }
      });
    }, (error) => {
      console.error("Error getting real-time updates: ", error);
    });

    return () => unsubscribe();
  }, [type, posts, newPosts]);

  const filteredPosts = posts.filter(post => post.type === type);

  const handleReaction = (postId: string, reactionType: ReactionType) => {
    setPosts(prev => 
      prev.map(post => {
        if (post.id === postId) {
          const isRemovingReaction = post.userReaction === reactionType;
          return {
            ...post,
            userReaction: isRemovingReaction ? null : reactionType,
            likes: isRemovingReaction ? post.likes - 1 : post.userReaction ? post.likes : post.likes + 1
          };
        }
        return post;
      })
    );
  };

  const handleComment = (postId: string) => {
    setActiveCommentPostId(activeCommentPostId === postId ? null : postId);
  };

  const handleAddComment = (postId: string, content: string, parentId?: string) => {
    setPosts(prev => 
      prev.map(post => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: `comment-${Date.now()}`,
            author: {
              id: 'currentUser',
              name: 'Current User',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me'
            },
            content,
            timestamp: 'Just now',
            likes: 0,
            isLiked: false
          };

          if (parentId) {
            // Add reply to parent comment
            return {
              ...post,
              comments: post.comments.map(comment => {
                if (comment.id === parentId) {
                  return {
                    ...comment,
                    replies: [...(comment.replies || []), newComment]
                  };
                }
                return comment;
              })
            };
          } else {
            // Add new top-level comment
            return {
              ...post,
              comments: [...post.comments, newComment]
            };
          }
        }
        return post;
      })
    );
  };

  const handleCommentLike = (commentId: string, liked: boolean) => {
    setPosts(prev => 
      prev.map(post => {
        // Check if the comment is a top-level comment
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: liked ? comment.likes + 1 : Math.max(0, comment.likes - 1),
              isLiked: liked
            };
          }
          
          // Check if the comment is a reply
          if (comment.replies) {
            const updatedReplies = comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  likes: liked ? reply.likes + 1 : Math.max(0, reply.likes - 1),
                  isLiked: liked
                };
              }
              return reply;
            });
            
            return {
              ...comment,
              replies: updatedReplies
            };
          }
          
          return comment;
        });
        
        return {
          ...post,
          comments: updatedComments
        };
      })
    );
  };

  const handleShare = (postId: string, method: 'public' | 'private' | 'group' | 'external' | 'copy') => {
    setPosts(prev => 
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            shares: post.shares + 1
          };
        }
        return post;
      })
    );
    
    switch (method) {
      case 'copy':
        alert(`Link copied to clipboard!`);
        break;
      case 'public':
        alert(`Post shared publicly!`);
        break;
      case 'private':
        alert(`Post shared as private message!`);
        break;
      case 'group':
        alert(`Post shared to group!`);
        break;
      case 'external':
        alert(`Post shared to external platform!`);
        break;
    }
  };

  const handleSave = (postId: string, saved: boolean) => {
    setPosts(prev => 
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isSaved: saved
          };
        }
        return post;
      })
    );
  };

  return (
    <div className="space-y-4" ref={feedRef}>
      {loading && (
        <Card className="p-4 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </Card>
      )}
      
      {!loading && filteredPosts.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No posts to display. Be the first to post!</p>
        </Card>
      )}
      
      {/* Animated new posts */}
      <AnimatePresence>
        {newPosts.map((post) => (
          <motion.div
            key={`new-${post.id}`}
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border-green-500 bg-green-50">
              <div className="absolute top-0 left-0 right-0 p-2 text-xs text-center bg-green-500 text-white">
                New post
              </div>
              <CardHeader className="flex flex-row items-center space-x-4 p-4 pt-8">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{post.author.name}</h3>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p 
                  className="mb-4" 
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                  style={{ 
                    direction: 'ltr', 
                    unicodeBidi: 'isolate', 
                    textAlign: 'left',
                    writingMode: 'horizontal-tb' 
                  }} 
                  dir="ltr"
                />
                
                {/* Post media */}
                {post.media && post.media.length > 0 && (
                  <div className={`mb-4 grid ${post.media.length > 1 ? 'grid-cols-2 gap-2' : ''}`}>
                    {post.media.map((media) => (
                      <div key={media.id} className="rounded-md overflow-hidden">
                        {media.type === 'image' ? (
                          <img 
                            src={media.url} 
                            alt=""
                            className="w-full h-auto object-cover"
                          />
                        ) : (
                          <video 
                            src={media.url} 
                            controls
                            className="w-full h-auto"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Post visibility and seen by */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <div className="flex items-center">
                    {post.visibility === 'public' ? (
                      <Globe className="w-3 h-3 mr-1" />
                    ) : post.visibility === 'friends' ? (
                      <Users className="w-3 h-3 mr-1" />
                    ) : (
                      <Lock className="w-3 h-3 mr-1" />
                    )}
                    {post.visibility === 'public' ? 'Public' : 
                     post.visibility === 'friends' ? 'Friends' : 
                     post.visibility === 'group' ? 'Group' : 'Private'}
                  </div>
                  {post.seenBy && post.seenBy.length > 0 && (
                    <div className="flex items-center">
                      <EyeIcon className="w-3 h-3 mr-1" />
                      Seen by {post.seenBy.length}
                    </div>
                  )}
                </div>
                
                {/* Post interactions */}
                <PostInteractions
                  postId={post.id}
                  likeCount={post.likes}
                  commentCount={post.comments.length}
                  shareCount={post.shares}
                  onReaction={handleReaction}
                  onComment={handleComment}
                  onShare={handleShare}
                  onSave={handleSave}
                  userReaction={post.userReaction}
                  isSaved={post.isSaved}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Regular posts */}
      {filteredPosts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center space-x-4 p-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{post.author.name}</h3>
              <p className="text-sm text-gray-500">{post.timestamp}</p>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p 
              className="mb-4" 
              dangerouslySetInnerHTML={{ __html: post.content }} 
              style={{ 
                direction: 'ltr', 
                unicodeBidi: 'isolate', 
                textAlign: 'left',
                writingMode: 'horizontal-tb' 
              }} 
              dir="ltr"
            />
            
            {/* Post media */}
            {post.media && post.media.length > 0 && (
              <div className={`mb-4 grid ${post.media.length > 1 ? 'grid-cols-2 gap-2' : ''}`}>
                {post.media.map((media) => (
                  <div key={media.id} className="rounded-md overflow-hidden">
                    {media.type === 'image' ? (
                      <img 
                        src={media.url} 
                        alt=""
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <video 
                        src={media.url} 
                        controls
                        className="w-full h-auto"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Post visibility and seen by */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <div className="flex items-center">
                {post.visibility === 'public' ? (
                  <Globe className="w-3 h-3 mr-1" />
                ) : post.visibility === 'friends' ? (
                  <Users className="w-3 h-3 mr-1" />
                ) : (
                  <Lock className="w-3 h-3 mr-1" />
                )}
                {post.visibility === 'public' ? 'Public' : 
                 post.visibility === 'friends' ? 'Friends' : 
                 post.visibility === 'group' ? 'Group' : 'Private'}
              </div>
              {post.seenBy && post.seenBy.length > 0 && (
                <div className="flex items-center">
                  <EyeIcon className="w-3 h-3 mr-1" />
                  Seen by {post.seenBy.length}
                </div>
              )}
            </div>
            
            {/* Post interactions */}
            <PostInteractions
              postId={post.id}
              likeCount={post.likes}
              commentCount={post.comments.length}
              shareCount={post.shares}
              onReaction={handleReaction}
              onComment={handleComment}
              onShare={handleShare}
              onSave={handleSave}
              userReaction={post.userReaction}
              isSaved={post.isSaved}
            />
            
            {/* Comments section */}
            {activeCommentPostId === post.id && (
              <CommentThread
                postId={post.id}
                comments={post.comments}
                onAddComment={handleAddComment}
                onLikeComment={handleCommentLike}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Helper function to simulate creating a new post
export async function simulateNewPost(postContent: string, postType: 'community' | 'personal', media: any[] = []) {
  try {
    const currentUser = {
      id: 'user1',
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    };

    // Create a new post object
    const newPost = {
      content: postContent,
      author: currentUser,
      createdAt: Timestamp.now(), // Use Firebase Timestamp
      likes: 0,
      comments: [],
      shares: 0,
      media: media,
      type: postType,
      userReaction: null,
      isSaved: false,
      visibility: 'public',
      seenBy: []
    };

    // Add to Firestore
    console.log('Adding post to Firestore...');
    const docRef = await addDoc(collection(db, 'posts'), newPost);
    console.log('Post added with ID:', docRef.id);

    return docRef.id;
  } catch (error) {
    console.error('Error adding post:', error);
    throw error;
  }
}