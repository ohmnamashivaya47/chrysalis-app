# 🌟 Chrysalis - Full-Stack Meditation App

A complete, production-ready meditation application with React frontend, Node.js backend, real-time features, and comprehensive user management.

## 🏗️ Architecture Overview

### Frontend (React 18 + TypeScript + Vite)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks + custom services
- **Real-time**: Socket.io client for live features
- **PWA**: Full Progressive Web App capabilities
- **Deployment**: Netlify (ready to deploy at [your-app-name.netlify.app](https://your-app-name.netlify.app))

### Backend (Node.js + Express + Socket.io)
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with bcrypt password hashing
- **Real-time**: Socket.io for live meditation sessions and social features
- **File Storage**: Multer for file uploads with cloud storage support
- **API**: RESTful API design with comprehensive error handling
- **Security**: Helmet, CORS, rate limiting, input validation

### Database (PostgreSQL + Prisma)
- **Primary Database**: Neon PostgreSQL (cloud-hosted)
- **ORM**: Prisma for type-safe database operations
- **Models**: Users, meditation sessions, social posts, leaderboards, QR codes
- **Migrations**: Automated schema migrations and seeding

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd chrysalis-meditation-app

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

Required environment variables:
```env
# Database
DATABASE_URL="postgresql://username:password@hostname:port/chrysalis_db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# API Configuration
VITE_API_URL="http://localhost:3001/api"
VITE_SOCKET_URL="ws://localhost:3001"
```

### 3. Database Setup
```bash
cd server
npx prisma generate
npx prisma db push
npx prisma db seed  # Optional: adds sample data
```

### 4. Start Development Servers

**Backend (Terminal 1):**
```bash
cd server
npm run dev
# Backend runs on http://localhost:3001
```

**Frontend (Terminal 2):**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### 5. Test the Application
```bash
# Run integration tests
./test-integration.sh
```

## 📂 Project Structure

```
chrysalis-meditation-app/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── ui/                  # Reusable UI components
│   │   ├── auth/                # Authentication components
│   │   ├── meditation/          # Meditation-specific components
│   │   └── social/              # Social features components
│   ├── pages/                   # Main application pages
│   ├── services/                # Business logic and API services
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
├── server/                      # Backend source code
│   ├── src/
│   │   ├── routes/              # API route handlers
│   │   ├── middleware/          # Express middleware
│   │   ├── sockets/             # Socket.io event handlers
│   │   └── app.ts               # Express app configuration
│   ├── dist/                    # Built backend code
│   └── uploads/                 # File upload storage
├── prisma/                      # Database schema and migrations
│   └── schema.prisma            # Database schema definition
├── public/                      # Static frontend assets
├── docs/                        # Documentation
└── deployment/                  # Deployment configurations
```

## 🌐 Production Deployment

### Backend Deployment (Railway/Heroku/Vercel)

1. **Build the backend:**
   ```bash
   cd server
   ./build-production.sh
   ```

2. **Deploy to Railway:**
   ```bash
   railway login
   railway up
   ```

3. **Configure environment variables:**
   - Set `DATABASE_URL` to your production PostgreSQL
   - Set `JWT_SECRET` to a strong secret
   - Set `NODE_ENV=production`

### Frontend Deployment (Netlify/Vercel)

1. **Build configuration in `netlify.toml`:**
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"
   
   [build.environment]
     VITE_API_URL = "https://your-backend-url.com/api"
     VITE_SOCKET_URL = "wss://your-backend-url.com"
   ```

2. **Deploy to Netlify:**
   - Connect your repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Configure environment variables

### Database Deployment (Neon PostgreSQL)

1. **Create database on Neon:**
   - Sign up at [neon.tech](https://neon.tech)
   - Create new project
   - Copy connection string

2. **Run migrations:**
   ```bash
   cd server
   DATABASE_URL="your-production-url" npx prisma db push
   ```

## ⚡ Key Features

### 🧘‍♀️ Meditation Features
- **Guided Sessions**: Multiple meditation types (mindfulness, breathing, etc.)
- **Custom Timers**: Flexible session durations
- **Background Sounds**: Nature sounds, binaural beats, silence
- **Progress Tracking**: Session history and statistics
- **Streaks**: Daily meditation streak tracking
- **Achievements**: Gamified progress system

### 👥 Social Features
- **Community Feed**: Share meditation experiences
- **Following System**: Connect with other meditators
- **Likes & Comments**: Engage with community posts
- **QR Code Sharing**: Quick profile and session sharing
- **Leaderboards**: Weekly and monthly meditation rankings

### 🔄 Real-time Features
- **Live Sessions**: Join meditation sessions with others
- **Real-time Updates**: Live progress sharing during sessions
- **Instant Notifications**: Achievement unlocks and social interactions
- **Socket.io Integration**: WebSocket-based real-time communication

### 📱 PWA Features
- **Offline Capability**: Works without internet connection
- **Push Notifications**: Meditation reminders and social updates
- **Install Prompt**: Add to home screen on mobile devices
- **Background Sync**: Sync data when connection returns

### 🔐 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: bcrypt hashing for passwords
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive data validation
- **CORS Protection**: Cross-origin request security

## 🛠️ API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Meditation Endpoints
- `GET /api/meditation/sessions` - Get user's meditation sessions
- `POST /api/meditation/start` - Start new meditation session
- `POST /api/meditation/complete` - Complete meditation session
- `GET /api/meditation/stats` - Get meditation statistics

### Social Endpoints
- `GET /api/social/feed` - Get social feed
- `POST /api/social/posts` - Create new post
- `POST /api/social/posts/:id/like` - Like/unlike post
- `GET /api/social/posts/:id/comments` - Get post comments
- `POST /api/social/posts/:id/comments` - Add comment

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/follow/:id` - Follow user
- `DELETE /api/users/follow/:id` - Unfollow user

### File Upload
- `POST /api/upload/profile-picture` - Upload profile picture
- `DELETE /api/upload/file/:filename` - Delete uploaded file

### QR Code Generation
- `POST /api/qr/generate-profile` - Generate profile QR code
- `POST /api/qr/generate-session` - Generate session QR code
- `POST /api/qr/parse` - Parse QR code data

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
./test-integration.sh
```

### E2E Tests
```bash
npm run test:e2e
```

## 📊 Monitoring and Analytics

### Error Tracking
- Server error logs with Winston
- Client error boundaries
- API error responses with detailed messages

### Performance Monitoring
- API response time tracking
- Frontend performance metrics
- Database query optimization

### Analytics (Optional)
- Google Analytics integration ready
- Custom event tracking for meditation sessions
- User engagement metrics

## 🔧 Development Tools

### Code Quality
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for code quality

### Build Tools
- **Vite**: Fast frontend build tool
- **TypeScript Compiler**: Backend compilation
- **Prisma**: Database schema management
- **PostCSS**: CSS processing

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues:**
   ```bash
   # Check DATABASE_URL format
   echo $DATABASE_URL
   # Test connection
   cd server && npx prisma db pull
   ```

2. **CORS Errors:**
   - Ensure frontend URL is in backend CORS configuration
   - Check `VITE_API_URL` environment variable

3. **Socket.io Connection Issues:**
   - Verify `VITE_SOCKET_URL` points to backend
   - Check if backend Socket.io server is running

4. **Build Failures:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards
- Use TypeScript for all new code
- Follow React functional component patterns
- Write tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vite Team** - For the lightning-fast build tool
- **Prisma Team** - For the excellent database toolkit
- **Socket.io Team** - For real-time communication
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/chrysalis/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/chrysalis/discussions)
- **Email**: support@chrysalis.app

---

**🌟 Transform your mind through meditation with Chrysalis - where technology meets mindfulness.**
