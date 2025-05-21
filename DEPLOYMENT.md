# Africanii Project Deployment Guide

This document outlines the steps for properly deploying the Africanii project with security best practices.

## Before Deployment

### 1. Environment Configuration

Create a proper `.env` file for your deployment environment:

```
# Firebase Configuration - Replace with your own values
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Development Settings
VITE_USE_FIREBASE_EMULATORS=false

# Other Configuration
NODE_ENV=production
```

### 2. Security Checklist

Before deploying to production, ensure you have:

- [ ] Removed all service account key files from the repository
- [ ] Added all sensitive files to `.gitignore`
- [ ] Removed hardcoded API keys from the codebase
- [ ] Implemented proper Firebase security rules
- [ ] Configured proper CORS settings
- [ ] Removed test credentials and accounts
- [ ] Added domain restrictions to your Firebase project

### 3. Firebase Security Rules Review

Review and tighten your Firebase security rules:

```
// Firestore Rules - Stricter version for production
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Basic rule: users need to be authenticated
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if false; // Default deny, override below
    }
    
    // User profiles - users can only write their own
    match /profiles/{userId} {
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Businesses - only owners or admins can write
    match /businessProfiles/{businessId} {
      allow write: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || 
         get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Events - users can create, but only owner or admin can update
    match /events/{eventId} {
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.createdBy == request.auth.uid || 
         get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

## Deployment Steps

### 1. Build the Project

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

### 2. Deploy to Firebase

```bash
# Make sure Firebase CLI is installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy to Firebase
firebase deploy
```

### 3. Post-Deployment Verification

After deployment, verify:

- Authentication flows work correctly
- Database security rules are enforced
- Storage access is properly restricted
- Application functions as expected in production environment

## Managing Production Credentials

### Rotating Keys

If you suspect your Firebase keys have been compromised:

1. Go to the Firebase Console
2. Navigate to Project Settings > Service accounts
3. Click "Generate new private key"
4. Update your environment variables with the new keys
5. Redeploy your application

### Monitoring Access

1. Enable Firebase Security Audit logs
2. Set up alerts for unusual authentication patterns
3. Regularly review access logs

## Rollback Procedure

If you need to rollback to a previous version:

```bash
# Deploy a specific version
firebase hosting:clone PROJECT_ID:live PROJECT_ID:live --version=VERSION_ID

# Or revert to the previous deployment
firebase hosting:rollback
```

## Troubleshooting

### Common Issues

1. **Authentication failures**: Check if your Firebase keys are correctly set up in environment variables
2. **Security rule errors**: Test your security rules in the Firebase console
3. **CORS issues**: Verify your CORS configuration in Firebase storage

For additional support, consult the Firebase documentation or contact project maintainers. 