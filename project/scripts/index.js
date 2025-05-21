const { spawn } = require('child_process');
const path = require('path');

console.log('📤 Starting Firebase Data Upload Process...');

// Run each script in sequence
async function runScripts() {
  try {
    // Step 1: Upload database records
    console.log('\n🔄 Step 1: Uploading database records to Firestore...');
    await runScript('upload-to-firebase.js');
    
    // Step 2: Upload assets to storage
    console.log('\n🔄 Step 2: Uploading assets to Firebase Storage...');
    await runScript('upload-assets.js');
    
    console.log('\n✅ All data and assets have been successfully uploaded to Firebase!');
    console.log('   Your application is ready to use the uploaded data.');
  } catch (error) {
    console.error('❌ Error during upload process:', error.message);
    process.exit(1);
  }
}

// Helper function to run a script and return a promise
function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, scriptName);
    console.log(`   Running: ${scriptPath}`);
    
    const child = spawn('node', [scriptPath], { stdio: 'inherit' });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptName} exited with code ${code}`));
      }
    });
    
    child.on('error', (err) => {
      reject(new Error(`Failed to start script ${scriptName}: ${err.message}`));
    });
  });
}

// Start the process
runScripts(); 