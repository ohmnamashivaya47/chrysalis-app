"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Access token required',
            });
            return;
        }
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Verify user still exists in database
        const user = await prisma.user.findUnique({
            where: { id: decoded.user_id },
            select: {
                id: true,
                email: true,
                username: true,
                is_public: true,
                last_active: true,
            },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'User not found',
            });
            return;
        }
        // Update last active timestamp
        await prisma.user.update({
            where: { id: user.id },
            data: { last_active: new Date() },
        });
        req.user = {
            id: user.id,
            email: user.email,
            username: user.username || '',
        };
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(403).json({
            success: false,
            error: 'Invalid or expired token',
        });
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            next();
            return;
        }
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await prisma.user.findUnique({
            where: { id: decoded.user_id },
            select: {
                id: true,
                email: true,
                username: true,
            },
        });
        if (user) {
            req.user = {
                id: user.id,
                email: user.email,
                username: user.username || '',
            };
        }
        next();
    }
    catch {
        // If token is invalid, continue without authentication
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map