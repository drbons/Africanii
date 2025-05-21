# Security Configuration for Africanii Project

This document outlines sensitive information that must be removed or secured before pushing to a public repository.

## Firebase Credentials

### Service Account Keys
The following service account key files contain sensitive credentials and MUST be removed:
- `project/service-account.json`
- `project/firebase-service-account.json`
- `boltafricanii-firebase-adminsdk-fbsvc-2ba98652e4.json.txt` (in root directory)

These files contain private keys that provide full administrative access to your Firebase project.

### Firebase Configuration
The Firebase configuration in `project/src/lib/firebase.ts` contains API keys that should be moved to environment variables:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD_BrDv0FD-b82KNUBFGaM0SXwRrKnQZDQ",
  authDomain: "boltafricanii.firebaseapp.com",
  projectId: "boltafricanii",
  storageBucket: "boltafricanii.appspot.com",
  messagingSenderId: "534902761582",
  appId: "1:534902761582:web:394c8fea5b78960e661e7f"
};
```

## Database Rules

### Firestore Rules
The Firestore rules in `project/firestore.rules` control access to your database. Current rules are very permissive:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read all documents
    match /{document=**} {
      allow read: if request.auth != null;
    }
    
    // Allow all other write operations for authenticated users
    match /{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

These should be tightened for production deployment.

### Storage Rules
The Storage rules in `project/storage.rules` are similarly permissive:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Environment Variables

Create a `.env` file template (`.env.example`) with the following structure instead of hardcoding values:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Security Recommendations

1. **Add to .gitignore**:
   ```
   # Firebase credentials
   *service-account*.json
   *.env
   *.env.local
   *.env.development.local
   *.env.test.local
   *.env.production.local
   ```

2. **Replace Hardcoded API Keys**:
   Update all hardcoded credentials with environment variables.

3. **Rotate Compromised Keys**:
   Since these credentials have been committed to a repository, they should be considered compromised and rotated in the Firebase console.

4. **Restrict API Keys**:
   Add domain restrictions to your Firebase API keys in the Google Cloud Console.

5. **Improve Security Rules**:
   Refine the Firestore and Storage rules to follow the principle of least privilege. 