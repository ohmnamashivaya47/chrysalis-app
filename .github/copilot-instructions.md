# Chrysalis Meditation App - Copilot Instructions

## Project Overview

Chrysalis is a modern, production-ready meditation web application built with React 18, TypeScript, and comprehensive backend integration. This is a full-stack PWA with social features, real-time capabilities, and advanced audio generation.

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** with custom design system
- **Framer Motion** for animations
- **PWA** with service workers

### Backend Integration
- **Neon PostgreSQL** with Prisma ORM
- **Socket.io** for real-time features
- **JWT** authentication
- **RESTful API** design

### Key Libraries
- `@tailwindcss/postcss` for styling
- `framer-motion` for animations
- `socket.io-client` for real-time
- `lucide-react` for icons
- `tailwind-merge` and `clsx` for utility classes

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI primitives (Button, Input, etc.)
│   ├── common/         # Shared components (Header, Navigation, etc.)
│   ├── auth/           # Authentication components
│   └── meditation/     # Meditation-specific components
├── pages/              # Main application pages
├── hooks/              # Custom React hooks
├── services/           # Business logic and API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # CSS and styling files

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
├── ARCHITECTURE.md    # Architecture overview
├── DEPLOYMENT.md      # Deployment guide
└── FEATURES.md        # Feature documentation
```

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow React 18 best practices with functional components and hooks
- Use Tailwind CSS utility classes with the `cn()` utility function
- Implement proper error boundaries and loading states
- Follow the component composition pattern

### File Naming
- Components: PascalCase (e.g., `MeditationCard.tsx`)
- Hooks: camelCase with "use" prefix (e.g., `useAuth.ts`)
- Services: camelCase (e.g., `authService.ts`)
- Types: PascalCase interfaces (e.g., `User`, `MeditationSession`)
- Utilities: camelCase (e.g., `cn.ts`)

### Component Patterns
- Use the compound component pattern for complex UI
- Implement proper prop interfaces with TypeScript
- Use forwardRef for components that need ref access
- Include proper accessibility attributes
- Use framer-motion for animations and transitions

### State Management
- Use React's built-in state management (useState, useReducer)
- Implement custom hooks for shared logic
- Use service singletons for global state and caching
- Follow the lifting state up pattern when needed

### Error Handling
- Implement proper error boundaries
- Use try-catch blocks in async functions
- Provide meaningful error messages to users
- Log errors appropriately for debugging

## Key Services

### 1. Authentication Service (`src/services/auth.ts`)
Handles user authentication, registration, and session management with JWT tokens.

Key methods:
- `login(credentials)` - User authentication
- `register(userData)` - User registration
- `logout()` - Session cleanup
- `getCurrentUser()` - Get current user state
- `verifyEmail(token)` - Email verification

### 2. Meditation Session Service (`src/services/meditationSession.ts`)
Manages meditation sessions, audio generation, and progress tracking.

Key methods:
- `startSession(config)` - Initialize meditation session
- `pauseSession()` - Pause current session
- `completeSession()` - Finish and save session
- `generateAudio(config)` - Create custom audio with Web Audio API

### 3. Social Feed Service (`src/services/socialFeed.ts`)
Handles social interactions, posts, and community features.

Key methods:
- `getFeed(options)` - Retrieve social feed
- `createPost(data)` - Create new post
- `likePost(postId)` - Like/unlike posts
- `followUser(userId)` - Follow/unfollow users

### 4. Audio Generation Service (`src/services/audioGenerator.ts`)
Generates meditation audio using Web Audio API.

Key methods:
- `generateBinauralBeats(frequency)` - Create binaural beats
- `createNatureSounds(config)` - Generate nature sounds
- `mixAudioSources(sources)` - Combine audio sources

### 5. QR Code Service (`src/services/qrCode.ts`)
Generates and manages QR codes for social sharing.

### 6. Leaderboard Service (`src/services/leaderboard.ts`)
Manages gamification, achievements, and competitive features.

### 7. Notification Service (`src/services/notifications.ts`)
Handles push notifications and in-app messaging.

### 8. Socket Service (`src/services/socket.ts`)
Manages real-time communication with Socket.io.

## React Hooks

### Custom Hooks
- `useAuth()` - Authentication state and methods
- `useMeditationSession()` - Session management
- `useOnboarding()` - User onboarding flow

### Hook Patterns
- Always include proper dependency arrays in useEffect
- Use useCallback for event handlers passed to child components
- Use useMemo for expensive calculations
- Implement proper cleanup in useEffect returns

## UI Components

### Design System
- **Colors**: Psychology-researched color palette (sage green, warm whites, calming blues)
- **Typography**: System fonts with carefully chosen hierarchy
- **Spacing**: Consistent spacing scale using Tailwind
- **Animations**: Subtle, calming animations with Framer Motion

### Component Library
Located in `src/components/ui/`:
- `Button.tsx` - Flexible button component with variants
- `Input.tsx` - Form input with validation states
- `Card.tsx` - Content containers
- `Modal.tsx` - Modal dialogs
- `Progress.tsx` - Progress indicators
- `Spinner.tsx` - Loading states
- `Badge.tsx` - Status indicators
- `Toggle.tsx` - Toggle switches

### Usage Example
```tsx
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

const MyComponent = () => {
  return (
    <Card className="p-6">
      <Button 
        variant="primary" 
        size="lg"
        onClick={handleClick}
      >
        Start Meditation
      </Button>
    </Card>
  );
};
```

## API Integration

### API Client (`src/services/api.ts`)
Centralized API client with:
- Request/response interceptors
- Error handling
- Authentication headers
- Type-safe responses

### Usage Pattern
```typescript
// Service method example
async createPost(postData: CreatePostData): Promise<Post> {
  try {
    const response = await apiClient.post<Post>('/social/posts', postData);
    return response.data;
  } catch (error) {
    this.handleError(error);
    throw error;
  }
}
```

## Database Schema (Prisma)

Key models in `prisma/schema.prisma`:
- `User` - User accounts and profiles
- `MeditationSession` - Session records and analytics
- `Post` - Social feed posts
- `Comment` - Post comments
- `Like` - Post likes
- `UserRelationship` - Following/followers
- `Achievement` - User achievements and badges

## Real-time Features

### Socket.io Events
- `meditation:update` - Live session updates
- `social:newPost` - Real-time social feed
- `leaderboard:update` - Live leaderboard changes
- `achievement:unlocked` - Achievement notifications

## PWA Features

### Service Worker (`public/sw.js`)
- Offline caching strategy
- Background sync
- Push notification handling
- Asset precaching

### Manifest (`public/manifest.json`)
- App metadata
- Icon definitions
- Display preferences
- Theme colors

## Build and Deployment

### Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build locally
- `npm run lint` - ESLint checking
- `npm run type-check` - TypeScript checking

### Deployment Targets
- **Frontend**: Netlify (configured in `netlify.toml`)
- **Backend**: Vercel/Railway (serverless functions)
- **Database**: Neon PostgreSQL
- **Socket Server**: Heroku/Railway

## Testing Approach

### Testing Strategy
- Unit tests for utilities and services
- Component tests with React Testing Library
- Integration tests for user flows
- E2E tests for critical paths

### Testing Files
- Place test files adjacent to source files
- Use `.test.tsx` or `.spec.tsx` extensions
- Mock external dependencies appropriately

## Performance Considerations

### Optimization Techniques
- Code splitting with React.lazy
- Image optimization (WebP format)
- Audio compression and streaming
- Service worker caching
- Bundle analysis and tree shaking

### Bundle Management
- Lazy load routes and heavy components
- Use dynamic imports for large libraries
- Optimize audio files for web delivery
- Implement progressive loading strategies

## Accessibility

### Standards
- WCAG 2.1 compliance
- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility

### Implementation
- Use semantic elements appropriately
- Include alt text for images
- Provide proper focus management
- Test with screen readers
- Maintain sufficient color contrast

## Security Considerations

### Frontend Security
- Content Security Policy headers
- Input sanitization
- XSS prevention
- Secure authentication token storage
- HTTPS enforcement

### Data Privacy
- GDPR compliance
- Minimal data collection
- User consent management
- Data export/deletion capabilities

## Common Patterns and Best Practices

### Component Composition
```tsx
// Good: Composable component pattern
<Card>
  <Card.Header>
    <Card.Title>Meditation Progress</Card.Title>
  </Card.Header>
  <Card.Content>
    <Progress value={75} />
  </Card.Content>
</Card>
```

### Error Handling
```tsx
// Good: Proper error boundary usage
<ErrorBoundary fallback={<ErrorFallback />}>
  <MeditationSession />
</ErrorBoundary>
```

### Loading States
```tsx
// Good: Consistent loading patterns
{loading ? (
  <Spinner className="mx-auto" />
) : (
  <MeditationList sessions={sessions} />
)}
```

### Type Safety
```tsx
// Good: Proper TypeScript usage
interface MeditationCardProps {
  session: MeditationSession;
  onStart: (sessionId: string) => void;
  className?: string;
}

const MeditationCard: React.FC<MeditationCardProps> = ({
  session,
  onStart,
  className
}) => {
  // Component implementation
};
```

## Debugging and Development

### Development Tools
- React DevTools for component inspection
- Redux DevTools for state management (if added)
- Network tab for API debugging
- Console for error tracking

### Common Debug Patterns
- Use proper console.log statements with context
- Implement error boundaries for graceful error handling
- Use TypeScript strict mode to catch errors early
- Test responsive design across devices

## Environment Configuration

### Environment Variables
- `VITE_API_BASE_URL` - API endpoint
- `VITE_SOCKET_URL` - Socket.io server URL
- `VITE_VAPID_PUBLIC_KEY` - Push notification public key
- `VITE_GA_ID` - Google Analytics ID (optional)

### Configuration Files
- `.env.example` - Template for environment variables
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## Contributing Guidelines

### Code Review Checklist
- [ ] TypeScript strict mode compliance
- [ ] Proper error handling
- [ ] Accessibility considerations
- [ ] Performance implications
- [ ] Test coverage
- [ ] Documentation updates

### Git Workflow
- Use conventional commits
- Create feature branches from main
- Submit pull requests for code review
- Maintain clean commit history

This project represents a production-ready meditation app with comprehensive features and modern development practices. Follow these guidelines to maintain code quality and consistency.
