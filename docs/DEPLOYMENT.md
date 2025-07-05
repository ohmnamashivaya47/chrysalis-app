# Chrysalis Deployment Guide

## Overview

This guide covers deploying the Chrysalis meditation app to production environments. The app is designed for modern cloud platforms with serverless architecture.

## Prerequisites

### Required Accounts

- [Netlify](https://netlify.com) - Frontend hosting
- [Neon](https://neon.tech) - PostgreSQL database
- [Vercel](https://vercel.com) or [Railway](https://railway.app) - Backend API
- [GitHub](https://github.com) - Source code repository

### Required Tools

- Node.js 18+ and npm
- Git
- Netlify CLI (optional)
- Vercel CLI (optional)

## Environment Setup

### 1. Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host:port/database?sslmode=require"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="24h"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"
REFRESH_TOKEN_EXPIRES_IN="7d"

# API Configuration
API_BASE_URL="https://your-api.vercel.app/api/v1"
CLIENT_URL="https://your-app.netlify.app"

# Email Service (SendGrid example)
SENDGRID_API_KEY="your-sendgrid-api-key"
FROM_EMAIL="noreply@your-domain.com"

# Push Notifications
VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
VAPID_SUBJECT="mailto:your-email@domain.com"

# File Storage (Cloudinary example)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Socket.io (if using separate server)
SOCKET_URL="https://your-socket-server.herokuapp.com"

# Analytics (optional)
GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"
MIXPANEL_TOKEN="your-mixpanel-token"
```

### 2. Database Setup (Neon)

1. Create a Neon account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection strings:
   - `DATABASE_URL` for Prisma with connection pooling
   - `DIRECT_URL` for direct connections (migrations)

4. Set up the database schema:

```bash
npx prisma generate
npx prisma db push
```

5. Seed the database (optional):

```bash
npx prisma db seed
```

## Frontend Deployment (Netlify)

### Method 1: Git Integration (Recommended)

1. **Push to GitHub:**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Netlify:**
   - Go to [Netlify](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Node version: `18` (in Environment variables)

3. **Environment Variables:**
   Add the following in Netlify dashboard under Site Settings > Environment Variables:

```
VITE_API_BASE_URL=https://your-api.vercel.app/api/v1
VITE_SOCKET_URL=https://your-socket-server.herokuapp.com
VITE_VAPID_PUBLIC_KEY=your-vapid-public-key
VITE_GA_ID=GA-XXXXXXXXX
```

4. **Build & Deploy:**
   - Netlify will automatically build and deploy
   - Your app will be available at `https://app-name.netlify.app`

### Method 2: Manual Deploy

1. **Build locally:**

```bash
npm run build
```

2. **Deploy with Netlify CLI:**

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### Custom Domain (Optional)

1. **Add domain in Netlify:**
   - Go to Site Settings > Domain Management
   - Add your custom domain

2. **Configure DNS:**
   - Add CNAME record: `www.yourdomain.com` → `app-name.netlify.app`
   - Add A record: `yourdomain.com` → Netlify's IP

3. **SSL Certificate:**
   - Netlify provides automatic HTTPS
   - Certificate will be provisioned automatically

## Backend Deployment (Vercel)

### 1. Project Setup

Create an `api` directory in your project root:

```bash
mkdir api
```

Create API endpoints in `api/` directory. Example `api/auth/login.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import { authService } from "../../src/services/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
```

### 2. Deploy to Vercel

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Deploy:**

```bash
vercel login
vercel --prod
```

3. **Environment Variables:**
   Add in Vercel dashboard under Project Settings > Environment Variables:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-jwt-secret
SENDGRID_API_KEY=your-sendgrid-key
# ... other backend variables
```

### Alternative: Railway Deployment

1. **Create Railway account** at [railway.app](https://railway.app)

2. **Deploy from GitHub:**
   - Connect your repository
   - Railway will detect Node.js and deploy automatically

3. **Environment Variables:**
   - Add all backend environment variables in Railway dashboard

## Socket.io Server Deployment

### Option 1: Separate Heroku App

1. **Create `server/Procfile`:**

```
web: node socket-server.js
```

2. **Deploy to Heroku:**

```bash
cd server
heroku create your-socket-server
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-socket-server
git push heroku main
```

### Option 2: Integrate with Vercel

Create `api/socket.ts`:

```typescript
import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

export default io;
```

## Database Migration

### Production Migration

1. **Backup existing data** (if applicable):

```bash
pg_dump $DATABASE_URL > backup.sql
```

2. **Run migrations:**

```bash
npx prisma migrate deploy
```

3. **Verify schema:**

```bash
npx prisma db pull
npx prisma generate
```

### Rollback Strategy

1. **Create rollback migration:**

```bash
npx prisma migrate dev --name rollback-feature-name
```

2. **Test rollback locally first:**

```bash
npx prisma migrate reset
npx prisma db push
```

## Monitoring & Observability

### 1. Error Monitoring

**Sentry Integration:**

```bash
npm install @sentry/react @sentry/tracing
```

Add to your app:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

### 2. Performance Monitoring

**Web Vitals:**

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

function sendToAnalytics(metric) {
  // Send to your analytics service
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 3. Uptime Monitoring

Set up monitoring with:

- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://pingdom.com)
- [StatusCake](https://statuscake.com)

Monitor these endpoints:

- Frontend: `https://your-app.netlify.app`
- API Health: `https://your-api.vercel.app/api/health`
- Socket.io: `https://your-socket.herokuapp.com/health`

## Security Configuration

### 1. Content Security Policy

Add to `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://your-api.vercel.app wss://your-socket.herokuapp.com;"
```

### 2. HTTPS Redirect

Add to `netlify.toml`:

```toml
[[redirects]]
  from = "http://yourdomain.com/*"
  to = "https://yourdomain.com/:splat"
  status = 301
  force = true
```

### 3. API Rate Limiting

Implement rate limiting in your API endpoints:

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
```

## Performance Optimization

### 1. Build Optimization

Update `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          framer: ["framer-motion"],
          ui: ["@headlessui/react", "@heroicons/react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion"],
  },
});
```

### 2. CDN Configuration

For static assets, use Cloudinary or similar:

```typescript
const cloudinaryUrl = (publicId: string, transforms?: string) => {
  const baseUrl = "https://res.cloudinary.com/your-cloud/image/upload";
  return `${baseUrl}/${transforms || "f_auto,q_auto"}/${publicId}`;
};
```

### 3. Service Worker Optimization

Update service worker for better caching:

```javascript
// In public/sw.js
const CACHE_NAME = "chrysalis-v1";
const urlsToCache = [
  "/",
  "/static/css/main.css",
  "/static/js/main.js",
  "/meditation-sounds/",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});
```

## Backup Strategy

### 1. Database Backups

Set up automated backups with Neon:

- Enable point-in-time recovery
- Schedule daily backups
- Store backups in multiple regions

### 2. Code Backups

- Use GitHub for source code
- Tag releases: `git tag v1.0.0`
- Maintain multiple branches: `main`, `staging`, `develop`

### 3. Asset Backups

For user-uploaded content:

- Use cloud storage with versioning
- Implement cross-region replication
- Regular backup verification

## Rollback Procedures

### 1. Frontend Rollback

**Netlify:**

```bash
# Rollback to previous deployment
netlify sites:list
netlify api listSiteDeploys --data='{"site_id":"your-site-id"}'
netlify api restoreSiteDeploy --data='{"site_id":"your-site-id","deploy_id":"previous-deploy-id"}'
```

### 2. Backend Rollback

**Vercel:**

```bash
# List deployments
vercel ls
# Promote previous deployment
vercel promote <deployment-url>
```

### 3. Database Rollback

```bash
# Restore from backup
pg_restore --verbose --clean --no-acl --no-owner -h host -U user -d database backup.sql
```

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Node.js version (use 18+)
   - Clear node_modules and reinstall
   - Check for missing environment variables

2. **Database Connection Issues:**
   - Verify connection strings
   - Check IP allowlisting
   - Ensure SSL is enabled

3. **CORS Errors:**
   - Add domain to CORS allowlist
   - Check API endpoint URLs
   - Verify protocol (HTTP vs HTTPS)

4. **Performance Issues:**
   - Enable gzip compression
   - Optimize bundle size
   - Use CDN for assets

### Debug Commands

```bash
# Check build locally
npm run build
npm run preview

# Test API endpoints
curl -X GET https://your-api.vercel.app/api/health

# Check database connection
npx prisma studio

# Analyze bundle size
npm run build -- --analyze
```

## Post-Deployment Checklist

###  Frontend

- [ ] App loads correctly
- [ ] All routes work
- [ ] PWA installation works
- [ ] Responsive design works
- [ ] Forms submit correctly

###  Backend

- [ ] API endpoints respond
- [ ] Authentication works
- [ ] Database queries execute
- [ ] File uploads work
- [ ] Error handling works

###  Integrations

- [ ] Socket.io connections work
- [ ] Push notifications work
- [ ] Email sending works
- [ ] External APIs respond
- [ ] Analytics tracking works

###  Performance

- [ ] Page load speed < 3s
- [ ] Lighthouse score > 90
- [ ] Bundle size optimized
- [ ] CDN serving assets
- [ ] Caching headers set

###  Security

- [ ] HTTPS enabled
- [ ] CSP headers set
- [ ] API authentication working
- [ ] Rate limiting active
- [ ] Error messages sanitized

This deployment guide provides a comprehensive approach to launching Chrysalis in production. Follow the steps carefully and test thoroughly before making the app available to users.
