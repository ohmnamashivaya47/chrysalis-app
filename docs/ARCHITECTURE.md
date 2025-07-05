# Chrysalis Architecture Documentation

## Overview

Chrysalis is a modern, production-ready meditation app built with React 18, TypeScript, and a comprehensive backend integration. The architecture follows clean architecture principles with clear separation of concerns.

## Technology Stack

### Frontend

- **React 18** - Modern React with concurrent features
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and interactions
- **PWA** - Progressive Web App capabilities

### Backend Integration

- **Neon PostgreSQL** - Serverless PostgreSQL database
- **Prisma ORM** - Type-safe database access
- **Socket.io** - Real-time communication
- **JWT** - Authentication and authorization

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **VS Code** - Optimized development environment

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI primitives
│   ├── common/         # Shared application components
│   ├── auth/           # Authentication components
│   └── meditation/     # Meditation-specific components
├── pages/              # Main application pages
├── hooks/              # Custom React hooks
├── services/           # Business logic and API integrations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # CSS and styling

public/
├── icons/              # PWA icons
├── meditation-sounds/  # Audio assets
├── manifest.json       # PWA manifest
└── sw.js              # Service worker

server/
├── socket-server.ts    # Socket.io server
└── package.json       # Server dependencies

docs/
├── API.md             # API documentation
├── ARCHITECTURE.md    # This file
├── DEPLOYMENT.md      # Deployment guide
└── FEATURES.md        # Feature documentation
```

## Core Services

### 1. Authentication Service (`auth.ts`)

Handles user authentication, registration, and session management.

**Key Features:**

- JWT token management
- Email verification
- Password reset functionality
- Persistent login state
- Secure token storage

```typescript
class AuthService {
  async register(userData: RegisterData): Promise<AuthResponse>;
  async login(credentials: LoginCredentials): Promise<AuthResponse>;
  async logout(): Promise<void>;
  async verifyEmail(token: string): Promise<boolean>;
  async resetPassword(email: string): Promise<boolean>;
}
```

### 2. Meditation Session Service (`meditationSession.ts`)

Manages meditation sessions, audio generation, and progress tracking.

**Key Features:**

- Session lifecycle management
- Web Audio API integration
- Real-time progress tracking
- Background sound mixing
- Session analytics

```typescript
class MeditationSessionService {
  async startSession(config: SessionConfig): Promise<MeditationSession>;
  async pauseSession(): Promise<void>;
  async resumeSession(): Promise<void>;
  async completeSession(): Promise<SessionResult>;
  generateAudio(config: AudioConfig): Promise<AudioBuffer>;
}
```

### 3. Social Feed Service (`socialFeed.ts`)

Handles social interactions, posts, and community features.

**Key Features:**

- Post creation and management
- Like and comment system
- User following/followers
- Content moderation
- Image/audio uploads

```typescript
class SocialFeedService {
  async getFeed(options: FeedOptions): Promise<PaginatedResponse<Post>>;
  async createPost(postData: CreatePostData): Promise<Post>;
  async likePost(postId: string): Promise<boolean>;
  async followUser(userId: string): Promise<boolean>;
}
```

### 4. Audio Generation Service (`audioGenerator.ts`)

Generates meditation audio using Web Audio API.

**Key Features:**

- Binaural beats generation
- Nature sound synthesis
- Voice guidance mixing
- Real-time audio processing
- Cross-fade transitions

```typescript
class AudioGenerationService {
  generateBinauralBeats(frequency: number): Promise<AudioBuffer>;
  createNatureSounds(config: NatureSoundConfig): Promise<AudioBuffer>;
  mixAudioSources(sources: AudioSource[]): Promise<AudioBuffer>;
}
```

### 5. Leaderboard Service (`leaderboard.ts`)

Manages gamification, achievements, and competitive features.

**Key Features:**

- Real-time leaderboards
- Achievement system
- Progress tracking
- Streak management
- Badge rewards

### 6. QR Code Service (`qrCode.ts`)

Handles QR code generation and sharing for social features.

**Key Features:**

- User profile QR codes
- Group invitation codes
- Share functionality
- Code validation

### 7. Notification Service (`notifications.ts`)

Manages push notifications and in-app messaging.

**Key Features:**

- Push notification subscription
- Reminder scheduling
- Achievement notifications
- Social interaction alerts

## Data Flow Architecture

### 1. Component Layer

React components handle UI rendering and user interactions.

```typescript
// Example: HomePage component
const HomePage = () => {
  const { user } = useAuth();
  const { sessions } = useMeditationSession();

  return (
    <Layout>
      <Header user={user} />
      <RecentSessions sessions={sessions} />
      <SocialFeed />
    </Layout>
  );
};
```

### 2. Hook Layer

Custom hooks manage component state and side effects.

```typescript
// Example: useAuth hook
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);
  }, []);

  return { user, loading, login, logout, register };
};
```

### 3. Service Layer

Services handle business logic and external API calls.

```typescript
// Example: API call with error handling
class ApiService {
  async request<T>(url: string, options?: RequestOptions): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new ApiError(response.status, await response.text());
      }

      return response.json();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}
```

## State Management

### Local State

Components use React's built-in state management (useState, useReducer) for local UI state.

### Global State

Shared state is managed through:

1. **Context API** - For authentication state
2. **Service Singletons** - For cached data and business logic
3. **Custom Hooks** - For shared stateful logic

### Persistence

- **LocalStorage** - User preferences, session data
- **IndexedDB** - Large data, offline support
- **Service Workers** - Background sync, caching

## Real-time Features

### Socket.io Integration

Real-time features are powered by Socket.io:

```typescript
class SocketService {
  connect(): void {
    this.socket = io(SOCKET_URL);
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.socket.on("meditation:update", this.handleMeditationUpdate);
    this.socket.on("social:newPost", this.handleNewPost);
    this.socket.on("leaderboard:update", this.handleLeaderboardUpdate);
  }
}
```

**Real-time Events:**

- Live meditation session updates
- Social feed real-time posts
- Leaderboard changes
- Achievement notifications
- Group meditation sessions

## Security Architecture

### Authentication

- JWT tokens with short expiration
- Refresh token rotation
- Secure token storage
- CSRF protection

### API Security

- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

### Data Privacy

- GDPR compliance
- Data encryption at rest
- Secure communication (HTTPS)
- User consent management

## Performance Optimization

### Frontend Optimization

- **Code Splitting** - Dynamic imports for routes
- **Lazy Loading** - Components and assets loaded on demand
- **Memoization** - React.memo, useMemo, useCallback
- **Virtual Scrolling** - For large lists
- **Image Optimization** - WebP format, responsive images

### Caching Strategy

- **Service Worker** - Offline caching
- **Browser Cache** - Static assets
- **Memory Cache** - API responses
- **CDN** - Global asset distribution

### Audio Optimization

- **Audio Compression** - Optimized file sizes
- **Streaming** - Progressive audio loading
- **Background Processing** - Web Workers for audio generation
- **Memory Management** - Proper AudioBuffer cleanup

## Testing Strategy

### Unit Testing

- Component testing with React Testing Library
- Service testing with Jest
- Mock external dependencies

### Integration Testing

- API integration tests
- End-to-end user flows
- Real-time feature testing

### Performance Testing

- Bundle size monitoring
- Runtime performance profiling
- Audio latency testing

## Deployment Architecture

### Build Process

1. TypeScript compilation
2. Bundle optimization with Vite
3. Asset optimization
4. Service worker generation
5. PWA manifest validation

### Hosting

- **Frontend** - Netlify (CDN, edge functions)
- **Backend** - Vercel/Railway (serverless functions)
- **Database** - Neon PostgreSQL (serverless)
- **Storage** - AWS S3/Cloudinary (assets)

### CI/CD Pipeline

1. Code quality checks (ESLint, TypeScript)
2. Automated testing
3. Build validation
4. Deployment to staging
5. Production deployment

## Monitoring and Analytics

### Error Tracking

- Frontend error monitoring
- API error logging
- Performance metrics

### User Analytics

- Session tracking
- Feature usage analytics
- Conversion funnels
- A/B testing support

### Health Monitoring

- API uptime monitoring
- Database performance
- Real-time connection health

## Scalability Considerations

### Horizontal Scaling

- Stateless service design
- Database connection pooling
- CDN for global distribution
- Load balancing

### Performance Scaling

- Database query optimization
- Caching layers
- Background job processing
- Image/audio CDN

### Feature Scaling

- Modular service architecture
- Plugin-based feature system
- Microservice migration path
- API versioning strategy

## Development Workflow

### Local Development

1. Clone repository
2. Install dependencies (`npm install`)
3. Set up environment variables
4. Start development server (`npm run dev`)
5. Run tests (`npm test`)

### Code Standards

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits
- Pull request reviews

### Release Process

1. Feature development in branches
2. Code review and testing
3. Merge to main branch
4. Automated deployment
5. Post-deployment verification
