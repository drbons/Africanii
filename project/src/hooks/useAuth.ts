import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { 
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onFirestoreError } from '@/lib/firebase';

export type UserRole = 'general' | 'business';

export interface UserProfile {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  role: UserRole;
  businessProfiles?: string[]; // IDs of business profiles associated with this user
}

export interface BusinessProfile {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  category: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  imageURL?: string;
  createdAt: number;
  updatedAt: number;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isOffline: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<boolean>;
  addBusinessProfile: (businessProfile: BusinessProfile) => Promise<boolean>;
}

const defaultContext: AuthContextType = {
  user: null,
  profile: null,
  loading: true,
  isOffline: false,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signOut: async () => {},
  updateProfile: async () => false,
  addBusinessProfile: async () => false
};

const AuthContext = createContext<AuthContextType>(defaultContext);

// Note: We've removed the enableIndexedDbPersistence call that was causing issues
// Persistence is now configured in the firebase.ts file instead

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Setup Firestore error handling
    const unsubscribeFirestore = onFirestoreError((error) => {
      console.error('Firestore error detected:', error);
      if (error.code === 'unavailable' || error.code === 'failed-precondition') {
        setIsOffline(true);
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', currentUser?.uid || 'No user');
      setUser(currentUser);
      if (currentUser) {
        try {
          const profileDoc = await getDoc(doc(db, 'profiles', currentUser.uid));
          setProfile(profileDoc.data() as UserProfile || null);
        } catch (error) {
          console.warn('Error fetching profile, using cached data if available:', error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Check for redirect result on mount
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        setUser(result.user);
      }
    }).catch((error) => {
      console.error('Error getting redirect result:', error);
    });

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      // Try popup first, fall back to redirect
      try {
        await signInWithPopup(auth, provider);
      } catch (popupError: any) {
        if (popupError.code === 'auth/popup-blocked') {
          // If popup is blocked, use redirect
          await signInWithRedirect(auth, provider);
        } else {
          throw popupError;
        }
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData: UserProfile): Promise<boolean> => {
    if (!user) throw new Error('No user logged in');
    try {
      await setDoc(doc(db, 'profiles', user.uid), profileData, { merge: true });
      setProfile(profileData);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const addBusinessProfile = async (businessProfile: BusinessProfile): Promise<boolean> => {
    if (!user) throw new Error('No user logged in');
    try {
      // Create/update the business profile document
      await setDoc(doc(db, 'businessProfiles', businessProfile.id), businessProfile);
      
      // Update the user's profile to include this business profile
      if (profile) {
        const updatedProfile = { ...profile };
        updatedProfile.businessProfiles = [...(profile.businessProfiles || []), businessProfile.id];
        await setDoc(doc(db, 'profiles', user.uid), updatedProfile, { merge: true });
        setProfile(updatedProfile);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding business profile:', error);
      return false;
    }
  };

  // Provide the authentication context
  const value = {
    user,
    profile,
    loading,
    isOffline,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile,
    addBusinessProfile
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}