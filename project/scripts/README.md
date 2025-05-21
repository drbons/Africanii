# Firebase Data Upload Scripts

This directory contains scripts to upload sample data and assets to Firebase for the Bolt African Business Directory application.

## Prerequisites

- Node.js 14+ installed
- Firebase project set up with Firestore and Storage enabled
- Service account credentials (already included in the scripts)

## Installation

Run the following command to install dependencies:

```bash
npm install
```

## Usage

### Upload All Data and Assets

To upload both data and assets in one go:

```bash
npm start
# or
npm run upload-all
```

### Upload Only Database Records

To upload only the database records to Firestore:

```bash
npm run upload-data
```

### Upload Only Assets

To upload only the assets to Firebase Storage:

```bash
npm run upload-assets
```

## What Gets Uploaded

These scripts will upload the following to your Firebase project:

1. **Database Records**:
   - Business profiles
   - User profiles
   - Posts
   - Comments

2. **Assets**:
   - Business images
   - Profile pictures (generated from APIs)
   
## Customization

You can modify the sample data in the respective script files:

- `upload-to-firebase.js`: Contains database records
- `upload-assets.js`: Contains asset URLs and storage paths

## Troubleshooting

If you encounter any issues:

1. Check that your Firebase credentials are correct
2. Ensure you have the necessary permissions in Firebase
3. Check the Firebase console to see if data is being uploaded properly

## Security Note

The service account credentials are included directly in the scripts for ease of use. In a production environment, you should:

1. Store credentials in environment variables
2. Add credentials files to .gitignore
3. Never commit sensitive credentials to version control 