# 🦋 Chrysalis - Meditation & Mindfulness App

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green)](https://web.dev/progressive-web-apps/)

> Transform your mind with comprehensive meditation and mindfulness tools featuring social connections, QR challenges, and personalized guidance.

##  Features

### ‍♀️ Core Meditation Features
- **Guided Meditations** - Extensive library of guided sessions 
- **Timer Sessions** - Customizable meditation timers with ambient sounds 
- **Progress Tracking** - Detailed analytics and streak tracking 
- **Personalized Recommendations** - AI-powered suggestions based on your practice 

### 🌐 Social & Community **[FULLY IMPLEMENTED]**
- **Social Feed** - Share insights and connect with the community 
- **Friends & Following** - Build connections with other practitioners 
- **Interactive Posts** - Like, comment, and share meditation experiences 
- **Community Statistics** - Live member counts and activity tracking 

###  Leaderboard & Gamification **[FULLY IMPLEMENTED]**
- **Rankings System** - Weekly, monthly, and all-time leaderboards 
- **Achievement Badges** - Unlock achievements for consistency and milestones 
- **Streak Tracking** - Maintain your meditation practice with visual streaks 
- **Personal Statistics** - Comprehensive meditation analytics dashboard 

###  QR Connect System **[FULLY IMPLEMENTED]**
- **QR Code Generation** - Create your personal meditation buddy QR code 
- **QR Scanner** - Connect with nearby meditators instantly 
- **Connection Management** - See online status and meditation activity 
- **Social Integration** - Share QR codes and build meditation networks 

### 👤 Complete Profile System **[FULLY IMPLEMENTED]**
- **User Dashboard** - Comprehensive meditation statistics and achievements 
- **Profile Editing** - Customize your meditation journey and bio 
- **Settings Management** - Privacy, notifications, and app preferences 
- **Progress Visualization** - Beautiful charts and meditation insights 

###  Progressive Web App (PWA)
- **Offline Support** - Meditate anywhere, even without internet 
- **Push Notifications** - Gentle reminders and achievement notifications 
- **App-like Experience** - Install on any device for native app feel 
- **Background Sync** - Sync your progress when you're back online 

###  Gamification & QR Codes
- **Achievement System** - Unlock badges and milestones 
- **Leaderboards** - Track your progress against the community 
- **QR Code Challenges** - Discover hidden meditation spots and challenges 
- **Streak Rewards** - Maintain your practice with streak bonuses 

### 🔊 Advanced Audio
- **3D Spatial Audio** - Immersive soundscapes using Web Audio API 
- **Custom Sound Generation** - Procedurally generated ambient sounds 
- **Binaural Beats** - Science-backed frequencies for deeper meditation 
- **Voice Guidance** - Multiple instructor voices and languages 

### 🔒 Privacy & Security
- **End-to-End Encryption** - Your meditation data stays private 
- **GDPR Compliant** - Full control over your personal data 
- **Local Storage** - Sensitive data stored locally when possible 
- **Anonymous Mode** - Practice without tracking if desired 

##  Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **PostgreSQL** database (we recommend [Neon](https://neon.tech/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/chrysalis-meditation-app.git
   cd chrysalis-meditation-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎮 Demo & Features

### Quick Demo
```bash
# Run the feature validation script
npm run demo

# Or check specific features
npm run demo:features
```

###  Live Feature Demo
The app is fully functional with all features implemented! Here's how to test each major feature:

#### 🏠 **Home Page** (`/`)
- Beautiful landing page with meditation overview
- Navigation to all app sections
- User authentication integration

#### 👥 **Social Feed** (`/social`)
- Complete community experience with posts and interactions
- Like and comment functionality
- User profiles and meditation statistics
- Real-time activity indicators

####  **Leaderboard** (`/leaderboard`)
- Weekly, monthly, and all-time rankings
- Achievement system with badges
- User statistics and streaks
- Beautiful rank visualizations

####  **QR Connect** (`/qr`)
- **Scan Tab**: Camera-based QR code scanning
- **Share Tab**: Generate your personal QR code
- **Connections Tab**: Manage your meditation buddies
- Real-time connection status

#### 👤 **Profile** (`/profile`)
- Comprehensive user dashboard
- Editable profile information
- Achievement showcase
- Settings and preferences
- Meditation statistics

#### ‍♀️ **Meditation** (`/meditate`)
- Meditation library and session management
- Audio generation and controls
- Progress tracking

### Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run type-check` | Run TypeScript type checking |
| `npm run test` | Run unit tests |
| `npm run test:coverage` | Generate test coverage report |
| `npm run db:studio` | Open Prisma Studio |
| `npm run deploy` | Deploy to production |

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Modern React with Hooks and Suspense
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - Simple state management

### Backend Integration
- **Prisma ORM** - Type-safe database queries
- **Socket.io** - Real-time communication
- **JWT Authentication** - Secure user sessions
- **RESTful API** - Clean and consistent API design

### Database
- **PostgreSQL** - Robust relational database
- **Neon** - Serverless PostgreSQL platform
- **Prisma Migrations** - Version-controlled schema changes

### Deployment
- **Netlify** - Frontend hosting and CI/CD
- **Edge Functions** - Serverless backend functions
- **CDN** - Global content delivery
- **Automatic SSL** - Secure HTTPS connections

## 📁 Project Structure

```
chrysalis-meditation-app/
├── 📁 public/                    # Static assets
│   ├── 📁 icons/                 # PWA icons
│   ├── 📁 meditation-sounds/     # Audio files
│   ├── manifest.json             # PWA manifest
│   └── sw.js                     # Service worker
├── 📁 src/
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 ui/               # Base UI components
│   │   ├── 📁 auth/             # Authentication components
│   │   ├── 📁 meditation/       # Meditation-specific components
│   │   └── 📁 common/           # Common layout components
│   ├── 📁 pages/                # Page components
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 services/             # Business logic and API calls
│   ├── 📁 types/                # TypeScript type definitions
│   ├── 📁 utils/                # Utility functions
│   └── 📁 styles/               # Global styles
├── 📁 server/                   # Socket.io server
├── 📁 prisma/                   # Database schema and migrations
├── 📁 scripts/                  # Build and deployment scripts
└── 📁 docs/                     # Documentation
```

## 🎨 Design System

### Color Palette
Based on psychological research for meditation and mindfulness:

- **Primary Blue** (`#6366f1`) - Trust and calmness
- **Deep Purple** (`#4c1d95`) - Spiritual depth
- **Soft Green** (`#10b981`) - Growth and healing
- **Warm Orange** (`#f59e0b`) - Energy and motivation
- **Neutral Grays** - Balance and focus

### Typography
- **Headings** - Inter (modern and clean)
- **Body** - System fonts for optimal readability
- **Code** - Fira Code for development

### Animations
All animations follow meditation principles:
- Smooth, organic transitions
- Breathing-inspired timing
- Minimal cognitive load
- Respectful of motion preferences

##  Configuration

### Environment Variables

Key environment variables (see `.env.example` for complete list):

```bash
# Core Application
VITE_APP_NAME=Chrysalis
VITE_API_URL=https://api.chrysalis.app

# Database
DATABASE_URL=postgresql://...

# Authentication
JWT_SECRET=your-secret-key

# Push Notifications
VAPID_PUBLIC_KEY=your-vapid-key
VAPID_PRIVATE_KEY=your-private-key

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### PWA Configuration

The app is configured as a Progressive Web App with:
- Offline support for core meditation features
- Push notifications for reminders
- App-like installation experience
- Background sync for progress tracking

##  Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Categories
- **Unit Tests** - Individual component and function testing
- **Integration Tests** - Feature workflow testing
- **E2E Tests** - Full user journey testing
- **Accessibility Tests** - WCAG compliance testing

##  Deployment

### Automatic Deployment (Recommended)

1. **Connect to Netlify**
   - Push to GitHub
   - Connect repository to Netlify
   - Automatic deployments on push

2. **Environment Variables**
   - Set production environment variables in Netlify dashboard
   - Ensure database URL points to production database

### Manual Deployment

```bash
# Build and deploy
npm run deploy

# Or deploy step by step
npm run build
npm run deploy:prod
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificate active
- [ ] Push notification keys set up
- [ ] Analytics configured
- [ ] Error tracking enabled
- [ ] Performance monitoring active

##  Performance

### Lighthouse Scores (Target)
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 95+
- **PWA**: 100

### Optimization Features
- Code splitting by route
- Image optimization and lazy loading
- Service worker caching
- Bundle analysis and tree shaking
- Critical CSS inlining

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Code Standards

- **TypeScript** - All code must be type-safe
- **ESLint** - Follow the configured linting rules
- **Prettier** - Code formatting is automatic
- **Conventional Commits** - Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [User Guide](docs/user-guide.md)
- [API Documentation](docs/api.md)
- [Developer Guide](docs/development.md)

### Community
- **Discord** - Join our developer community
- **GitHub Issues** - Report bugs and request features
- **Email** - support@chrysalis.app

### Troubleshooting

Common issues and solutions:

**Build Issues**
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

**Database Issues**
```bash
# Reset database
npm run db:reset
npm run db:push
```

**TypeScript Errors**
```bash
# Regenerate types
npm run db:generate
npm run type-check
```

---

<div align="center">

**Made with 💜 by the Chrysalis Team**

[Website](https://chrysalis.app) • [Documentation](docs/) • [Community](https://discord.gg/chrysalis) • [Support](mailto:support@chrysalis.app)

</div>
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
