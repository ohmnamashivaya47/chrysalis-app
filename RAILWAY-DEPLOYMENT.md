# 🚀 Railway Deployment Guide for Chrysalis Backend

## Quick Railway Deployment Steps

### 1. Create Railway Account
- Go to: https://railway.app
- Sign up with GitHub (recommended)
- Verify your email

### 2. Deploy from GitHub

#### Option A: Connect Repository (Recommended)
1. Click "Deploy from GitHub repo"
2. Select your `kingdomshouldvecome` repository
3. Choose the `server` folder as root directory
4. Railway will auto-detect Node.js and deploy

#### Option B: Deploy from Local
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. In server directory: `railway deploy`

### 3. Add Environment Variables
In Railway dashboard, go to your project → Variables, add:

```env
DATABASE_URL=your_database_url_here
JWT_SECRET=your-production-jwt-secret-here
NODE_ENV=production
PORT=5000

# Mailgun
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=sandbox4f69beda14494eaf91b9306f23b1c723.mailgun.org

# Cloudinary
CLOUDINARY_URL=cloudinary://718768962237724:HxmlPrLJM_a520dsLU59JVuvrjk@ddblpagys
CLOUDINARY_CLOUD_NAME=ddblpagys
CLOUDINARY_API_KEY=718768962237724
CLOUDINARY_API_SECRET=HxmlPrLJM_a520dsLU59JVuvrjk

# Firebase
FIREBASE_PROJECT_ID=chrysalis-meditation
FIREBASE_API_KEY=AIzaSyCxcwFKJQF-RNy7T1SYKO76o8c2Wy8AMuw
FIREBASE_MESSAGING_SENDER_ID=249558929926
FIREBASE_APP_ID=1:249558929926:web:e2fc4ed52b1e1768942987

# Google Analytics
GA_MEASUREMENT_ID=G-J03THT2CJL
GA_STREAM_ID=11442831562
```

### 4. Configure Build & Start Commands
Railway should auto-detect, but if needed:
- **Build Command**: `npm run build:prod`
- **Start Command**: `npm start`

### 5. Get Your Railway URL
After deployment, Railway will give you a URL like:
`https://your-app-name.up.railway.app`

## 🎯 What Happens Next
1. Railway deploys your backend
2. You get a production URL
3. I'll update your frontend to use this URL
4. Your app will be live! 🚀

## ⚡ Expected Timeline
- **Deployment**: 3-5 minutes
- **First build**: 2-3 minutes  
- **Total**: ~8 minutes to live backend

Once you have the Railway URL, share it and I'll update the frontend immediately!
