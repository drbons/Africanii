# Manual CORS Configuration Instructions

Since we cannot directly use `gsutil` through the terminal, here are manual steps to configure CORS for your Firebase Storage bucket:

## Option 1: Using Google Cloud Console

1. Go to the Google Cloud Console: https://console.cloud.google.com/
2. Select your Firebase project: `boltafricanii`
3. Navigate to Cloud Storage > Buckets
4. Select your bucket: `boltafricanii.appspot.com`
5. Go to the "Permissions" tab
6. Click on "CORS configuration"
7. Add the following CORS configuration:

```json
[
  {
    "origin": ["https://boltafricanii.web.app", "https://boltafricanii.firebaseapp.com", "http://localhost:5173"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Content-Length", "Content-Encoding", "Content-Disposition", "Cache-Control", "x-goog-meta-custom"]
  }
]
```

8. Save the configuration

## Option 2: Using Google Cloud SDK Shell

If you have Google Cloud SDK installed:

1. Open Google Cloud SDK Shell
2. Run the following command:

```bash
gsutil cors set cors.json gs://boltafricanii.appspot.com
```

## Option 3: Using the Firebase Console

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `boltafricanii`
3. Navigate to Storage
4. Click on the "Rules" tab
5. Make sure your rules allow authenticated users to upload:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to read and write images
    match /images/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. Then go to project settings and verify that your website domain is in the authorized domains list

## Verify CORS Configuration

You can verify your CORS configuration with this command if you have Google Cloud SDK:

```bash
gsutil cors get gs://boltafricanii.appspot.com
```

If everything is set correctly, your image uploads should now work. 