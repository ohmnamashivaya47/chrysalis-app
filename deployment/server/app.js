"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = exports.app = exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const client_1 = require("@prisma/client");
// Route imports
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const meditation_1 = __importDefault(require("./routes/meditation"));
const social_1 = __importDefault(require("./routes/social"));
const leaderboard_1 = __importDefault(require("./routes/leaderboard"));
const qr_1 = __importDefault(require("./routes/qr"));
const upload_1 = __importDefault(require("./routes/upload"));
// Middleware imports
const auth_2 = require("./middleware/auth");
const errorHandler_1 = require("./middleware/errorHandler");
// Socket handlers
const socketHandlers_1 = require("./sockets/socketHandlers");
// Initialize Prisma client with error handling
exports.prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    errorFormat: 'pretty',
});
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
exports.server = server;
// Socket.io setup
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? ['https://ohmnamashivaya47.netlify.app', 'https://chrysalis.app']
            : ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
exports.io = io;
// Security middleware
app.use((0, helmet_1.default)({
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
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://ohmnamashivaya47.netlify.app', 'https://chrysalis.app']
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
    },
});
app.use('/api/', limiter);
// Strict rate limiting for auth endpoints
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit auth attempts
    message: {
        error: 'Too many authentication attempts, please try again later.',
    },
});
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Static file serving for uploads
app.use('/uploads', express_1.default.static('uploads'));
// Logging
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('combined'));
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
app.use('/api/auth', authLimiter, auth_1.default);
app.use('/api/users', auth_2.authenticateToken, users_1.default);
app.use('/api/meditation', auth_2.authenticateToken, meditation_1.default);
app.use('/api/social', auth_2.authenticateToken, social_1.default);
app.use('/api/leaderboard', auth_2.authenticateToken, leaderboard_1.default);
app.use('/api/qr', auth_2.authenticateToken, qr_1.default);
app.use('/api/upload', auth_2.authenticateToken, upload_1.default);
// Socket.io initialization
(0, socketHandlers_1.setupSocketHandlers)(io);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
    });
});
// Error handling middleware (must be last)
app.use(errorHandler_1.errorHandler);
//# sourceMappingURL=app.js.map