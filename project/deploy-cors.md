# Deploying CORS Configuration for Firebase Storage

This guide provides step-by-step instructions to deploy the CORS configuration for your Firebase Storage bucket, which is necessary to fix the CORS policy blocking errors.

## Using Google Cloud Console (Recommended Method)

1. Go to the Google Cloud Console: https://console.cloud.google.com/
2. Make sure you're logged in with the same account that owns your Firebase project
3. Select your Firebase project: `boltafricanii`
4. Navigate to Cloud Storage > Buckets
5. Click on your bucket name: `boltafricanii.appspot.com`
6. Go to the "Settings" tab
7. Scroll down to "CORS configuration" 
8. Click "Edit" next to CORS configuration
9. Add the following JSON configuration:

```json
[
  {
    "origin": ["https://boltafricanii.web.app", "https://boltafricanii.firebaseapp.com", "http://localhost:5173"],
    "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization", "Content-Length", "Content-Encoding", "x-goog-meta-*"]
  }
]
```

10. Click "Save"

## Using Google Cloud SDK (Alternative Method)

If you have Google Cloud SDK installed:

1. Install Google Cloud SDK if you haven't already: https://cloud.google.com/sdk/docs/install
2. Open a terminal or command prompt
3. Log in to Google Cloud:
   ```
   gcloud auth login
   ```
4. Set your project:
   ```
   gcloud config set project boltafricanii
   ```
5. Make sure you have the CORS configuration file (cors.json) in your current directory
6. Run the gsutil command:
   ```
   gsutil cors set cors.json gs://boltafricanii.appspot.com
   ```
7. Verify the configuration:
   ```
   gsutil cors get gs://boltafricanii.appspot.com
   ```

## Deploying Updated Storage Rules

After setting the CORS configuration, also deploy the updated storage rules:

1. Make sure you're in the project directory that contains your storage.rules file
2. Run the Firebase CLI command:
   ```
   firebase deploy --only storage
   ```

## Verification

To verify everything is working correctly:

1. Clear your browser cache or use an incognito/private window
2. Visit your application at https://boltafricanii.web.app
3. Try uploading an image when creating a business profile
4. Check the browser console for any CORS-related errors

If you're still experiencing issues, check:

1. Make sure the Authentication is working properly
2. Verify the Firebase configuration in your code
3. Check that the storage bucket name is correct
4. Inspect network requests in the browser console to see specific error details 