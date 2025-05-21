const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin with application default credentials
admin.initializeApp({
  storageBucket: 'boltafricanii.appspot.com'
});

// Read the CORS configuration
const corsConfig = JSON.parse(fs.readFileSync('./cors.json', 'utf8'));
console.log('CORS Configuration:', JSON.stringify(corsConfig, null, 2));

// Get a reference to the storage service
const bucket = admin.storage().bucket();

// Function to set CORS
async function setCors() {
  try {
    // Set metadata on the bucket
    await bucket.setMetadata({
      cors: corsConfig
    });
    
    console.log('CORS configuration has been set successfully!');
    
    // Get bucket metadata to verify
    const [metadata] = await bucket.getMetadata();
    console.log('Current CORS configuration:', JSON.stringify(metadata.cors, null, 2));
  } catch (error) {
    console.error('Error setting CORS:', error);
  }
}

setCors(); 