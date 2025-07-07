# 🧘 Chrysalis Meditation App

A modern, full-stack meditation application built with React, TypeScript, and Node.js.

## 🚀 Quick Deployment Status

### ✅ Backend (LIVE)
- **URL**: https://chrysalis-meditation.onrender.com
- **Status**: ✅ Deployed and running
- **Health**: https://chrysalis-meditation.onrender.com/health

### 🔄 Frontend (Deploy Now)
- **Method 1**: Drag & Drop to Netlify
- **Method 2**: GitHub Integration
- **Method 3**: Netlify CLI

## 🎯 Deploy Frontend Now

### Option 1: Netlify Drag & Drop (Fastest)
```bash
./deploy-frontend.sh
```
Then drag the `dist/` folder to: https://app.netlify.com/drop

### Option 2: GitHub Integration
1. Go to: https://app.netlify.com/start
2. Connect GitHub: `https://github.com/ohmnamashivaya47/chrysalis-app`
3. Auto-deploy with `netlify.toml` configuration

### Option 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --dir=dist --prod
```

### Auto-Deploy Script
```bash
./deploy.sh
```

## 🔧 Environment Setup

1. Copy `.env` to `.env.local` and fill in your values
2. Copy `server/.env` to `server/.env.local` and fill in your values
3. Set up your database (PostgreSQL recommended)
4. Configure external services (Mailgun, Cloudinary, etc.)

## 📦 Manual Deployment

### Frontend
```bash
npm install
npm run build
npm run preview
```

### Backend
```bash
cd server
npm install
npm run build
npm start
```

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, Prisma, PostgreSQL
- **Real-time**: Socket.io
- **Authentication**: JWT
- **File Upload**: Cloudinary

## 📝 License

MIT License - feel free to use for your own projects!
