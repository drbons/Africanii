/**
 * This script sets CORS configuration for a Firebase Storage bucket.
 * 
 * Usage: node set-cors.js
 */

const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

// Initialize storage
const storage = new Storage();
const bucketName = 'boltafricanii.appspot.com';

async function setCors() {
  try {
    // Read the CORS configuration from cors.json
    const corsFilePath = path.join(__dirname, 'cors.json');
    const corsConfig = JSON.parse(fs.readFileSync(corsFilePath, 'utf8'));
    
    console.log('Setting CORS configuration for:', bucketName);
    console.log('Configuration:', JSON.stringify(corsConfig, null, 2));
    
    // Set the CORS configuration
    await storage.bucket(bucketName).setCorsConfiguration(corsConfig);
    
    console.log('CORS configuration set successfully!');
    
    // Get and display the current configuration
    const [metadata] = await storage.bucket(bucketName).getMetadata();
    console.log('Current CORS configuration:');
    console.log(JSON.stringify(metadata.cors, null, 2));
  } catch (error) {
    console.error('Error setting CORS configuration:', error);
  }
}

setCors(); 