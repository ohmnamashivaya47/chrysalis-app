"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qrcode_1 = __importDefault(require("qrcode"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Generate QR code for user profile
router.post('/generate-profile', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, bio: true }
    });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const profileData = {
        type: 'profile',
        user_id: user.id,
        username: user.username,
        name: user.username,
        timestamp: new Date().toISOString()
    };
    const qrData = JSON.stringify(profileData);
    try {
        const qrCodeUrl = await qrcode_1.default.toDataURL(qrData);
        res.json({
            success: true,
            qrCode: qrCodeUrl,
            data: profileData
        });
    }
    catch (error) {
        console.error('QR Code generation error:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
}));
// Generate QR code for meditation session sharing
router.post('/generate-session', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { sessionId } = req.body;
    const userId = req.user.id;
    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
    }
    const session = await prisma.meditationSession.findFirst({
        where: {
            id: sessionId,
            user_id: userId
        },
        include: {
            user: {
                select: { username: true, bio: true }
            }
        }
    });
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    const sessionData = {
        type: 'meditation-session',
        sessionId: session.id,
        user_id: userId,
        username: session.user.username,
        name: session.user.username,
        duration: session.duration_minutes,
        sessionType: session.meditation_type,
        completedAt: session.completed_at,
        timestamp: new Date().toISOString()
    };
    const qrData = JSON.stringify(sessionData);
    try {
        const qrCodeUrl = await qrcode_1.default.toDataURL(qrData);
        res.json({
            success: true,
            qrCode: qrCodeUrl,
            data: sessionData
        });
    }
    catch (error) {
        console.error('QR Code generation error:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
}));
// Parse and validate QR code data
router.post('/parse', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { qrData } = req.body;
    if (!qrData) {
        return res.status(400).json({ error: 'QR data is required' });
    }
    try {
        const parsedData = JSON.parse(qrData);
        // Validate QR data structure
        if (!parsedData.type || !parsedData.timestamp) {
            return res.status(400).json({ error: 'Invalid QR code format' });
        }
        // Check if QR code is not too old (24 hours)
        const qrTimestamp = new Date(parsedData.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - qrTimestamp.getTime()) / (1000 * 60 * 60);
        if (hoursDiff > 24) {
            return res.status(400).json({ error: 'QR code has expired' });
        }
        const result = {
            type: parsedData.type,
            valid: true
        };
        if (parsedData.type === 'profile') {
            // Verify user exists
            const user = await prisma.user.findUnique({
                where: { id: parsedData.userId },
                select: {
                    id: true,
                    username: true,
                    avatar_url: true,
                    is_public: true,
                    total_meditation_minutes: true,
                    _count: {
                        select: {
                            meditation_sessions: true,
                            followers: true,
                            following: true
                        }
                    }
                }
            });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            result.user = {
                id: user.id,
                username: user.username,
                firstName: '', // Default empty string for compatibility
                lastName: '', // Default empty string for compatibility  
                avatar_url: user.avatar_url,
                isPublic: user.is_public,
                totalMeditationMinutes: user.total_meditation_minutes || 0,
                meditationSessions: user._count.meditation_sessions,
                followers: user._count.followers,
                following: user._count.following
            };
        }
        else if (parsedData.type === 'meditation-session') {
            // Verify session exists
            const session = await prisma.meditationSession.findUnique({
                where: { id: parsedData.sessionId },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            avatar_url: true
                        }
                    }
                }
            });
            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }
            result.session = {
                id: session.id,
                type: session.meditation_type,
                duration: session.duration_minutes,
                completedAt: session.completed_at,
                user: {
                    id: session.user.id,
                    username: session.user.username,
                    firstName: '',
                    lastName: '',
                    avatar_url: session.user.avatar_url
                }
            };
        }
        res.json(result);
    }
    catch (error) {
        console.error('QR parsing error:', error);
        res.status(400).json({ error: 'Invalid QR code data' });
    }
}));
// Connect with user via QR code
router.post('/connect', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { qrData } = req.body;
    const currentUserId = req.user.id;
    if (!qrData) {
        return res.status(400).json({ error: 'QR data is required' });
    }
    try {
        const parsedData = JSON.parse(qrData);
        if (parsedData.type !== 'profile') {
            return res.status(400).json({ error: 'QR code is not for user profile' });
        }
        const targetUserId = parsedData.userId;
        if (currentUserId === targetUserId) {
            return res.status(400).json({ error: 'Cannot connect to yourself' });
        }
        // Check if already following
        const existingRelation = await prisma.userRelationship.findUnique({
            where: {
                follower_id_following_id: {
                    follower_id: currentUserId,
                    following_id: targetUserId
                }
            }
        });
        if (existingRelation) {
            return res.status(400).json({ error: 'Already following this user' });
        }
        // Create follow relationship
        await prisma.userRelationship.create({
            data: {
                follower_id: currentUserId,
                following_id: targetUserId
            }
        });
        // Get updated user info
        const user = await prisma.user.findUnique({
            where: { id: targetUserId },
            select: {
                id: true,
                username: true,
                avatar_url: true,
                _count: {
                    select: {
                        followers: true,
                        following: true
                    }
                }
            }
        });
        res.json({
            success: true,
            message: 'Successfully connected',
            user
        });
    }
    catch (error) {
        console.error('QR connect error:', error);
        res.status(500).json({ error: 'Failed to connect via QR code' });
    }
}));
exports.default = router;
//# sourceMappingURL=qr.js.map