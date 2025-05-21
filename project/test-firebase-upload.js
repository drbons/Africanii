const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Path to your service account key
const serviceAccount = require('./service-account.json');

// TODO: Replace with your actual Firebase Storage bucket name
const bucketName = '<your-bucket-name>.appspot.com';

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: bucketName,
});

const bucket = admin.storage().bucket();

// Path to the file you want to upload
const localFilePath = path.join(__dirname, 'readme1');
const destination = 'test-uploads/readme1'; // Path in Firebase Storage

bucket.upload(localFilePath, {
  destination,
})
  .then(() => {
    console.log('File uploaded successfully!');
  })
  .catch((err) => {
    console.error('Upload failed:', err);
  }); 