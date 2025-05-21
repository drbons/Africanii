import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { collection, getDocs, query, orderBy, limit, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Define the Comment interface
export interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
}

// Define the Tag interface
export interface Tag {
  id: string;
  type: 'topic' | 'location' | 'user';
  name: string;
}

// Define the Post interface
export interface Post {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  commentsList?: Comment[];
  type: 'community' | 'personal';
  imageUrl?: string;
  videoUrl?: string;
  documentUrl?: string;
  tags?: Tag[];
  location?: string;
  edited?: boolean;
  editTimestamp?: string;
}

// Sample posts for initial data
const samplePosts: Post[] = [
  {
    id: '1',
    content: 'Just launched my new African cuisine restaurant in Atlanta!',
    author: {
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    timestamp: '2 hours ago',
    likes: 24,
    comments: 5,
    commentsList: [
      {
        id: 'comment1',
        author: {
          name: 'Sarah Smith',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
        },
        content: 'Congratulations! Looking forward to trying it out.',
        timestamp: '1 hour ago'
      }
    ],
    type: 'community',
    location: 'Atlanta, GA',
    tags: [
      { id: 't1', type: 'topic', name: 'Cuisine' },
      { id: 't2', type: 'location', name: 'Atlanta' }
    ]
  },
  {
    id: '2',
    content: 'Looking for African fabric suppliers in Houston area. Any recommendations?',
    author: {
      name: 'Sarah Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    timestamp: '4 hours ago',
    likes: 15,
    comments: 3,
    commentsList: [],
    type: 'personal',
    location: 'Houston, TX'
  },
  {
    id: '3',
    content: 'Excited to announce our new African art gallery opening next month in Chicago!',
    author: {
      name: 'Michael Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
    },
    timestamp: '6 hours ago',
    likes: 32,
    comments: 12,
    commentsList: [],
    type: 'community',
    location: 'Chicago, IL',
    tags: [
      { id: 't3', type: 'location', name: 'Chicago' },
      { id: 't4', type: 'user', name: 'AfricanArt' }
    ]
  }
];

// Define the PostContext type
interface PostContextType {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  addPost: (content: string, imageUrl?: string, videoUrl?: string, documentUrl?: string, tags?: Tag[], location?: string) => Promise<void>;
  editPost: (postId: string, newContent: string, newImageUrl?: string, newVideoUrl?: string, newDocumentUrl?: string, newTags?: Tag[]) => Promise<void>;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  addComment: (postId: string, comment: string) => void;
  sharePost: (postId: string) => void;
  deletePost: (postId: string) => Promise<void>;
  refreshPosts: () => void;
}

// Create the PostContext
const PostContext = createContext<PostContextType | null>(null);

// Provider component
export function PostProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Load posts from Firestore if available, otherwise use sample data
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const postsCollection = collection(db, 'posts');
        const postsQuery = query(
          postsCollection,
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        
        try {
          console.log('Fetching posts from Firestore...');
          const querySnapshot = await getDocs(postsQuery);
          
          if (!querySnapshot.empty) {
            const fetchedPosts: Post[] = [];
            
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              fetchedPosts.push({
                id: doc.id,
                content: data.content || '',
                author: {
                  name: data.author?.name || 'Unknown User',
                  avatar: data.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`
                },
                timestamp: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleString() : 'Recently',
                likes: data.likes || 0,
                comments: data.comments?.length || 0,
                commentsList: data.comments || [],
                type: data.type || 'community',
              });
            });
            
            if (fetchedPosts.length > 0) {
              console.log('Using Firestore posts:', fetchedPosts.length);
              setPosts(fetchedPosts);
              return;
            }
          }
        } catch (firestoreError) {
          console.warn('Firestore fetch failed, using sample data:', firestoreError);
        }
        
        // If Firestore fetch fails or returns no data, use sample data
        console.log('Using sample posts data');
        setPosts(samplePosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [refreshKey]);

  const refreshPosts = () => {
    setRefreshKey(prev => prev + 1);
  };

  const addPost = async (
    content: string, 
    imageUrl?: string, 
    videoUrl?: string, 
    documentUrl?: string, 
    tags?: Tag[], 
    location?: string
  ) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Create a new post
      const newPost: Post = {
        id: `post-${Date.now()}`,
        content,
        author: {
          name: user.displayName || 'User',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName || 'User'}`
        },
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        commentsList: [],
        type: 'personal',
        imageUrl,
        videoUrl,
        documentUrl,
        tags,
        location: location || 'Atlanta, GA' // Default location or from user profile
      };
      
      // Add new post to the beginning of the posts array
      setPosts(prev => [newPost, ...prev]);
      
      // Try to save to Firebase if available
      try {
        const postsCollection = collection(db, 'posts');
        const firestorePost = {
          ...newPost,
          createdAt: Timestamp.now(),
        };
        await addDoc(postsCollection, firestorePost);
      } catch (firestoreError) {
        console.warn('Failed to save post to Firestore:', firestoreError);
      }
    } catch (err) {
      console.error('Error adding post:', err);
      setError('Failed to create post');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const editPost = async (
    postId: string, 
    newContent: string, 
    newImageUrl?: string, 
    newVideoUrl?: string, 
    newDocumentUrl?: string, 
    newTags?: Tag[]
  ) => {
    setIsLoading(true);
    try {
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                content: newContent,
                imageUrl: newImageUrl !== undefined ? newImageUrl : post.imageUrl,
                videoUrl: newVideoUrl !== undefined ? newVideoUrl : post.videoUrl,
                documentUrl: newDocumentUrl !== undefined ? newDocumentUrl : post.documentUrl,
                tags: newTags !== undefined ? newTags : post.tags,
                edited: true,
                editTimestamp: 'Edited just now'
              } 
            : post
        )
      );
      
      // Try to update in Firebase if available
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          content: newContent,
          imageUrl: newImageUrl,
          videoUrl: newVideoUrl,
          documentUrl: newDocumentUrl,
          tags: newTags,
          edited: true,
          editTimestamp: Timestamp.now()
        });
      } catch (firestoreError) {
        console.warn('Failed to update post in Firestore:', firestoreError);
      }
    } catch (err) {
      console.error('Error editing post:', err);
      setError('Failed to edit post');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const likePost = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 } 
          : post
      )
    );
    
    // Try to update in Firebase if available
    try {
      const postRef = doc(db, 'posts', postId);
      const currentPost = posts.find(p => p.id === postId);
      if (currentPost) {
        updateDoc(postRef, {
          likes: currentPost.likes + 1
        });
      }
    } catch (firestoreError) {
      console.warn('Failed to update likes in Firestore:', firestoreError);
    }
  };

  const unlikePost = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId && post.likes > 0
          ? { ...post, likes: post.likes - 1 } 
          : post
      )
    );
    
    // Try to update in Firebase if available
    try {
      const postRef = doc(db, 'posts', postId);
      const currentPost = posts.find(p => p.id === postId);
      if (currentPost) {
        updateDoc(postRef, {
          likes: Math.max(0, currentPost.likes - 1)
        });
      }
    } catch (firestoreError) {
      console.warn('Failed to update likes in Firestore:', firestoreError);
    }
  };

  const addComment = (postId: string, commentContent: string) => {
    if (!user) return;
    
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      content: commentContent,
      author: {
        name: user.displayName || 'User',
        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName || 'User'}`
      },
      timestamp: 'Just now'
    };
    
    setPosts(prev => 
      prev.map(post => {
        if (post.id === postId) {
          const updatedCommentsList = [...(post.commentsList || []), newComment];
          return { 
            ...post, 
            comments: post.comments + 1,
            commentsList: updatedCommentsList
          };
        }
        return post;
      })
    );
    
    // Try to update in Firebase if available
    try {
      const postRef = doc(db, 'posts', postId);
      const post = posts.find(p => p.id === postId);
      if (post) {
        updateDoc(postRef, {
          comments: (post.commentsList || []).length + 1,
          commentsList: [...(post.commentsList || []), newComment]
        });
      }
    } catch (firestoreError) {
      console.warn('Failed to update comments in Firestore:', firestoreError);
    }
  };

  const sharePost = (postId: string) => {
    // This would implement sharing functionality in a real app
    console.log(`Sharing post with ID: ${postId}`);
    
    // For now, just show a message in the console
    alert('Post shared successfully!');
  };

  const deletePost = async (postId: string) => {
    setIsLoading(true);
    try {
      setPosts(prev => prev.filter(post => post.id !== postId));
      
      // Try to delete from Firebase if available
      try {
        const postRef = doc(db, 'posts', postId);
        await deleteDoc(postRef);
      } catch (firestoreError) {
        console.warn('Failed to delete post from Firestore:', firestoreError);
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PostContext.Provider 
      value={{ 
        posts, 
        isLoading, 
        error, 
        addPost, 
        editPost,
        likePost,
        unlikePost,
        addComment, 
        sharePost,
        deletePost,
        refreshPosts 
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

// Custom hook to use the PostContext
export function usePostContext() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
} 