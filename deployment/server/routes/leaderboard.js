"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Get leaderboard
router.get('/', async (req, res) => {
    try {
        const { timeframe = 'week', page = 1, limit = 50 } = req.query;
        let dateFilter = {};
        const now = new Date();
        if (timeframe === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateFilter = { completed_at: { gte: weekAgo } };
        }
        else if (timeframe === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            dateFilter = { completed_at: { gte: monthAgo } };
        }
        const leaderboardData = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                avatar_url: true,
                total_meditation_minutes: true,
                meditation_sessions: {
                    where: {
                        completed: true,
                        ...dateFilter,
                    },
                    select: {
                        duration_minutes: true,
                    },
                },
            },
            orderBy: {
                total_meditation_minutes: 'desc',
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
        });
        const leaderboard = leaderboardData.map((user, index) => {
            const periodMinutes = user.meditation_sessions.reduce((sum, session) => sum + session.duration_minutes, 0);
            return {
                rank: (Number(page) - 1) * Number(limit) + index + 1,
                id: user.id,
                username: user.username,
                avatarUrl: user.avatar_url,
                totalMinutes: user.total_meditation_minutes,
                periodMinutes,
                sessionsCount: user.meditation_sessions.length,
            };
        });
        res.json({
            success: true,
            data: leaderboard,
        });
    }
    catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get leaderboard',
        });
    }
});
exports.default = router;
//# sourceMappingURL=leaderboard.js.map