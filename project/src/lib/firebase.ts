import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase app instance - this is lightweight
const app = initializeApp(firebaseConfig);

// Create lazy-loaded Firebase service getters to delay initialization until needed
let _auth;
let _db;
let _storage;
let persistenceEnabled = false;

// Lazily initialize auth
export const auth = (() => {
  if (!_auth) {
    _auth = getAuth(app);
  }
  return _auth;
})();

// Lazily initialize db with persistence optimization
export const db = (() => {
  if (!_db) {
    _db = getFirestore(app);
    
    // Set up persistence only once and only if we're in a browser
    if (typeof window !== 'undefined' && !persistenceEnabled) {
      // Enable offline persistence (don't wait for this promise)
      enableIndexedDbPersistence(_db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore persistence unavailable - multiple tabs open');
        } else if (err.code === 'unimplemented') {
          console.warn('Firestore persistence unavailable in this browser');
        } else {
          console.error('Error enabling Firestore persistence:', err);
        }
      });
      persistenceEnabled = true;
    }
  }
  return _db;
})();

// Lazily initialize storage
export const storage = (() => {
  if (!_storage) {
    _storage = getStorage(app);
  }
  return _storage;
})();

// Connect to emulators if in development mode
// This check prevents connecting to emulators in production
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  // connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

export default app;

// Test user login function with better error handling
export const signInTestUser = async () => {
  try {
    // Try to sign in first
    await signInWithEmailAndPassword(auth, "test@example.com", "password123");
  } catch (signInError) {
    try {
      // If sign in fails, create the test user
      await createUserWithEmailAndPassword(auth, "test@example.com", "password123");
    } catch (createError) {
      // If creation fails, try signing in again (user might exist now)
      await signInWithEmailAndPassword(auth, "test@example.com", "password123");
    }
  }
};

/**
 * Extracts user-friendly error messages from Firebase error objects
 * @param error The Firebase error object
 * @returns A readable error message
 */
export const getFirebaseErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  // Handle Firebase auth error codes
  if (error.code) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email address is already in use.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Your password is too weak. Please choose a stronger password.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful login attempts. Please try again later.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/requires-recent-login':
        return 'This operation requires you to re-login. Please sign out and sign in again.';
      case 'auth/popup-closed-by-user':
        return 'The login popup was closed before authentication was completed.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for OAuth operations.';
      case 'auth/operation-not-allowed':
        return 'This operation is not allowed. Please contact support.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email but different sign-in credentials.';
      case 'unavailable':
        return 'The service is temporarily unavailable. Please check your internet connection.';
      case 'failed-precondition':
        return 'This operation could not be executed in the current state.';
      case 'unauthenticated':
        return 'You need to be signed in to perform this action.';
      case 'permission-denied':
        return 'You do not have permission to perform this action.';
      default:
        return error.message || 'An error occurred during authentication. Please try again.';
    }
  }
  
  // If no code but has message
  if (error.message) {
    return error.message;
  }
  
  // If error is a string
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred. Please try again.';
};

/**
 * A helper function to listen for Firestore errors.
 * This is a simple implementation as Firestore doesn't have a direct error event.
 */
export const onFirestoreError = (callback: (error: any) => void) => {
  // In a real-world app, you would implement this differently
  // Perhaps with a global error handler or by monitoring specific operations
  
  // For now, just return a cleanup function
  return () => {
    // No cleanup needed for this simple implementation
  };
};