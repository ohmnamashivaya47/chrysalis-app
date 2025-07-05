# 🔥 Firebase Cleanup & Setup Guide

## Steps to Clean Your Firebase Project

### 1. Go to Firebase Console
- Visit: https://console.firebase.google.com
- Select your `chrysalis-meditation` project

### 2. Clean Up Old Data
- **Firestore Database**: Delete all collections if any exist
- **Authentication**: Remove any test users
- **Storage**: Delete old files if any
- **Functions**: Delete old cloud functions if any

### 3. Enable Required Services

#### Enable Authentication:
- Go to Authentication → Sign-in method
- Enable "Email/Password"
- Enable "Anonymous" (for guest sessions)

#### Enable Cloud Messaging:
- Go to Cloud Messaging
- Note down the Server Key for push notifications

#### Enable Analytics:
- Go to Analytics
- Link to your Google Analytics account (G-J03THT2CJL)

### 4. Get Firebase Config
Your current config looks good:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCxcwFKJQF-RNy7T1SYKO76o8c2Wy8AMuw",
  authDomain: "chrysalis-meditation.firebaseapp.com", 
  projectId: "chrysalis-meditation",
  storageBucket: "chrysalis-meditation.firebasestorage.app",
  messagingSenderId: "249558929926",
  appId: "1:249558929926:web:e2fc4ed52b1e1768942987",
  measurementId: "G-70L6S1QVE5"
};
```

### 5. Get Server Key for Backend
- Go to Project Settings → Cloud Messaging
- Copy the "Server key"
- Add to environment variables:

```env
FIREBASE_SERVER_KEY=your_server_key_here
```

## ✅ Final Firebase Environment Variables
```env
FIREBASE_PROJECT_ID=chrysalis-meditation
FIREBASE_API_KEY=AIzaSyCxcwFKJQF-RNy7T1SYKO76o8c2Wy8AMuw
FIREBASE_MESSAGING_SENDER_ID=249558929926
FIREBASE_APP_ID=1:249558929926:web:e2fc4ed52b1e1768942987
FIREBASE_SERVER_KEY=your_server_key_from_console
```
