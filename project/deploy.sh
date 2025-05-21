#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Deploy Firebase hosting, storage rules, and Firestore rules
echo "Deploying to Firebase..."
firebase deploy --only hosting,storage,firestore

echo "Deployment complete!" 