import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';

// Route imports
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import meditationRoutes from './routes/meditation';
import socialRoutes from './routes/social';
import leaderboardRoutes from './routes/leaderboard';
import qrRoutes from './routes/qr';
import uploadRoutes from './routes/upload';

// Middleware imports
import { authenticateToken } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { validateRequest } from './middleware/validation';

// Socket handlers
import { setupSocketHandlers } from './sockets/socketHandlers';

// Initialize Prisma client with error handling
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
});

const app = express();
const server = createServer(app);

// Socket.io setup
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-app-name.netlify.app', 'https://chrysalis.app']
      : ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-app-name.netlify.app', 'https://chrysalis.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', limiter);

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit auth attempts
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.VITE_APP_VERSION || '1.0.0',
  });
});

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/meditation', authenticateToken, meditationRoutes);
app.use('/api/social', authenticateToken, socialRoutes);
app.use('/api/leaderboard', authenticateToken, leaderboardRoutes);
app.use('/api/qr', authenticateToken, qrRoutes);
app.use('/api/upload', authenticateToken, uploadRoutes);

// Socket.io initialization
setupSocketHandlers(io);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export { app, server, io };
