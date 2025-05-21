import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Google Cloud Storage client
const storage = new Storage({
  projectId: 'boltafricanii',
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account-key.json'
});

// Get the bucket
const bucket = storage.bucket('boltafricanii.appspot.com');

// Read the CORS configuration
const corsConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'cors.json'), 'utf8'));

async function applyCors() {
  try {
    // Apply the CORS configuration to the bucket
    await bucket.setCorsConfiguration(corsConfig);
    console.log('CORS configuration applied successfully!');
  } catch (error) {
    console.error('Error applying CORS configuration:', error);
  }
}

applyCors(); 