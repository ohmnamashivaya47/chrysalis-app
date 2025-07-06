# 🧘 Chrysalis Meditation App

A modern, full-stack meditation application built with React, TypeScript, and Node.js.

## 🚀 One-Click Deployment

### Deploy Backend to Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ohmnamashivaya47/chrysalis-app)

**Note**: The `render.yaml` file is configured to build and run the backend from the `/server` directory.

### Deploy Frontend to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ohmnamashivaya47/chrysalis-app)

### Manual Render Setup
If the one-click deploy doesn't work:
1. Connect your GitHub repo to Render
2. Set build command: `cd server && npm install && npm run build`
3. Set start command: `cd server && npm start`
4. Add environment variables from `server/.env`

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
