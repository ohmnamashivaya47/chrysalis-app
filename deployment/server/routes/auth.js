"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const validation_1 = require("../middleware/validation");
const errorHandler_1 = require("../middleware/errorHandler");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Register endpoint
router.post('/register', (0, validation_1.validateRequest)(validation_1.schemas.register), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, username, bio } = req.body;
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                ...(username ? [{ username }] : []),
            ],
        },
    });
    if (existingUser) {
        res.status(409).json({
            success: false,
            error: existingUser.email === email
                ? 'Email already registered'
                : 'Username already taken',
        });
        return;
    }
    // Hash password
    const saltRounds = 12;
    const password_hash = await bcryptjs_1.default.hash(password, saltRounds);
    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            password_hash,
            username: username || email.split('@')[0],
            bio: bio || null,
            email_verified: false, // In production, send verification email
        },
        select: {
            id: true,
            email: true,
            username: true,
            bio: true,
            avatar_url: true,
            created_at: true,
            is_public: true,
            total_meditation_minutes: true,
            email_verified: true,
            qr_code: true,
        },
    });
    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jsonwebtoken_1.default.sign({
        user_id: user.id,
        email: user.email,
        username: user.username,
    }, secret, { expiresIn: '7d' });
    res.status(201).json({
        success: true,
        data: {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                bio: user.bio,
                avatarUrl: user.avatar_url,
                createdAt: user.created_at,
                isPublic: user.is_public,
                totalMeditationMinutes: user.total_meditation_minutes,
                emailVerified: user.email_verified,
                qrCode: user.qr_code,
            },
            token,
        },
    });
}));
// Login endpoint
router.post('/login', (0, validation_1.validateRequest)(validation_1.schemas.login), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res.status(401).json({
            success: false,
            error: 'Invalid email or password',
        });
    }
    // Verify password
    const isValidPassword = await bcryptjs_1.default.compare(password, user.password_hash);
    if (!isValidPassword) {
        return res.status(401).json({
            success: false,
            error: 'Invalid email or password',
        });
    }
    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jsonwebtoken_1.default.sign({
        user_id: user.id,
        email: user.email,
        username: user.username,
    }, secret, { expiresIn: '7d' });
    // Update last active
    await prisma.user.update({
        where: { id: user.id },
        data: { last_active: new Date() },
    });
    res.json({
        success: true,
        data: {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                bio: user.bio,
                avatarUrl: user.avatar_url,
                createdAt: user.created_at,
                isPublic: user.is_public,
                totalMeditationMinutes: user.total_meditation_minutes,
                emailVerified: user.email_verified,
                lastActive: user.last_active,
                qrCode: user.qr_code,
            },
            token,
        },
    });
}));
// Get current user
router.get('/me', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            email: true,
            username: true,
            bio: true,
            avatar_url: true,
            created_at: true,
            is_public: true,
            total_meditation_minutes: true,
            email_verified: true,
            last_active: true,
            qr_code: true,
        },
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found',
        });
    }
    res.json({
        success: true,
        data: {
            id: user.id,
            email: user.email,
            username: user.username,
            bio: user.bio,
            avatarUrl: user.avatar_url,
            createdAt: user.created_at,
            isPublic: user.is_public,
            totalMeditationMinutes: user.total_meditation_minutes,
            emailVerified: user.email_verified,
            lastActive: user.last_active,
            qrCode: user.qr_code,
        },
    });
}));
// Logout endpoint (client-side token removal)
router.post('/logout', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    // In a more sophisticated setup, you might maintain a token blacklist
    // For now, we'll just return success and let the client remove the token
    res.json({
        success: true,
        data: undefined,
    });
}));
// Refresh token endpoint
router.post('/refresh', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jsonwebtoken_1.default.sign({
        user_id: req.user.id,
        email: req.user.email,
        username: req.user.username,
    }, secret, { expiresIn: '7d' });
    res.json({
        success: true,
        data: { token },
    });
}));
exports.default = router;
//# sourceMappingURL=auth.js.map