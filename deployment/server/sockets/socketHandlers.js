"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = exports.authenticateSocket = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
// Middleware to authenticate socket connections
const authenticateSocket = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.user_id },
            select: { id: true, username: true, is_public: true }
        });
        if (!user) {
            return next(new Error('Authentication error: User not found'));
        }
        socket.userId = user.id;
        socket.username = user.username;
        next();
    }
    catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication error: Invalid token'));
    }
};
exports.authenticateSocket = authenticateSocket;
// Setup socket handlers
const setupSocketHandlers = (io) => {
    io.use(exports.authenticateSocket);
    io.on('connection', (socket) => {
        console.log(`User ${socket.username} connected`);
        // Join user to their personal room
        const userRoom = `user:${socket.userId}`;
        socket.join(userRoom);
        // Meditation session handlers
        socket.on('meditation:start', async (data) => {
            try {
                const { type, duration, settings } = data;
                // Create meditation session in database
                const session = await prisma.meditationSession.create({
                    data: {
                        user_id: socket.userId,
                        meditation_type: type,
                        duration_minutes: duration,
                        audio_settings: settings ? JSON.stringify(settings) : null,
                        started_at: new Date(),
                    }
                });
                // Notify user that session started
                socket.emit('meditation:started', {
                    sessionId: session.id,
                    type: session.meditation_type,
                    duration: session.duration_minutes,
                    startedAt: session.started_at
                });
                // Join meditation session room for real-time updates
                socket.join(`meditation:${session.id}`);
            }
            catch (error) {
                console.error('Meditation start error:', error);
                socket.emit('meditation:error', { error: 'Failed to start meditation session' });
            }
        });
        socket.on('meditation:progress', async (data) => {
            try {
                const { sessionId, currentTime, heartRate } = data;
                // Verify session belongs to user
                const session = await prisma.meditationSession.findFirst({
                    where: {
                        id: sessionId,
                        user_id: socket.userId
                    }
                });
                if (!session) {
                    socket.emit('meditation:error', { error: 'Session not found' });
                    return;
                }
                // Update session progress  
                await prisma.meditationSession.update({
                    where: { id: sessionId },
                    data: {
                        session_data: JSON.stringify({
                            currentTime,
                            heartRate: heartRate || null,
                            lastHeartbeatAt: new Date()
                        })
                    }
                });
                // Broadcast progress to session room
                io.to(`meditation:${sessionId}`).emit('meditation:progress-update', {
                    sessionId,
                    currentTime,
                    heartRate,
                    timestamp: new Date()
                });
            }
            catch (error) {
                console.error('Meditation progress error:', error);
                socket.emit('meditation:error', { error: 'Failed to update progress' });
            }
        });
        socket.on('meditation:complete', async (data) => {
            try {
                const { sessionId, finalStats } = data;
                // Verify session belongs to user
                const session = await prisma.meditationSession.findFirst({
                    where: {
                        id: sessionId,
                        user_id: socket.userId
                    }
                });
                if (!session) {
                    socket.emit('meditation:error', { error: 'Session not found' });
                    return;
                }
                // Complete the session
                const completedSession = await prisma.meditationSession.update({
                    where: { id: sessionId },
                    data: {
                        completed_at: new Date(),
                        completed: true,
                        session_data: JSON.stringify({
                            actualDuration: finalStats?.actualDuration || session.duration_minutes,
                            averageHeartRate: finalStats?.averageHeartRate,
                            ...finalStats
                        })
                    }
                });
                // Update user's meditation streak and total time
                const user = await prisma.user.findUnique({
                    where: { id: socket.userId },
                    include: {
                        meditation_sessions: {
                            where: { completed_at: { not: null } },
                            orderBy: { completed_at: 'desc' }
                        }
                    }
                });
                if (user) {
                    const sessionData = JSON.parse(completedSession.session_data || '{}');
                    // Calculate total meditation time
                    let totalMeditationTime = 0;
                    for (const session of user.meditation_sessions) {
                        const data = JSON.parse(session.session_data || '{}');
                        totalMeditationTime += data.actualDuration || session.duration_minutes;
                    }
                    await prisma.user.update({
                        where: { id: socket.userId },
                        data: {
                            total_meditation_minutes: totalMeditationTime
                        }
                    });
                    // Broadcast achievement if milestone reached
                    if (totalMeditationTime > 0) {
                        const milestones = [300, 900, 1800, 3600, 7200]; // 5min, 15min, 30min, 1hr, 2hr
                        const reachedMilestone = milestones.find(milestone => totalMeditationTime >= milestone &&
                            (totalMeditationTime - (sessionData.actualDuration || completedSession.duration_minutes)) < milestone);
                        if (reachedMilestone) {
                            const achievement = {
                                meditation_type: 'meditation_time',
                                milestone: reachedMilestone,
                                title: `${reachedMilestone / 60} minutes of total meditation`,
                                timestamp: new Date()
                            };
                            socket.emit('achievement:unlocked', achievement);
                            io.emit('leaderboard:update'); // Notify all users to refresh leaderboard
                        }
                    }
                }
            }
            catch (error) {
                console.error('Meditation complete error:', error);
                socket.emit('meditation:error', { error: 'Failed to complete session' });
            }
        });
        // Social feed handlers
        socket.on('social:join-feed', () => {
            socket.join('social:feed');
            console.log(`${socket.username} joined social feed`);
        });
        socket.on('social:leave-feed', () => {
            socket.leave('social:feed');
            console.log(`${socket.username} left social feed`);
        });
        socket.on('social:new-post', async (data) => {
            try {
                const { content, type } = data;
                const post = await prisma.post.create({
                    data: {
                        user_id: socket.userId,
                        content,
                        is_guided_meditation: type === 'guided_meditation'
                    },
                    include: {
                        user: {
                            select: {
                                username: true,
                                avatar_url: true
                            }
                        },
                        _count: {
                            select: {
                                likes: true,
                                comments: true
                            }
                        }
                    }
                });
                // Broadcast new post to all users in social feed
                io.to('social:feed').emit('social:post-created', {
                    id: post.id,
                    content: post.content,
                    type: post.is_guided_meditation ? 'guided_meditation' : 'text',
                    createdAt: post.created_at,
                    user: post.user,
                    likesCount: post._count.likes,
                    commentsCount: post._count.comments,
                    isLiked: false
                });
            }
            catch (error) {
                console.error('Social post error:', error);
                socket.emit('social:error', { error: 'Failed to create post' });
            }
        });
        socket.on('social:like-post', async (data) => {
            try {
                const { postId } = data;
                // Toggle like
                const existingLike = await prisma.like.findUnique({
                    where: {
                        user_id_post_id: {
                            user_id: socket.userId,
                            post_id: postId
                        }
                    }
                });
                let isLiked;
                if (existingLike) {
                    await prisma.like.delete({
                        where: { id: existingLike.id }
                    });
                    isLiked = false;
                }
                else {
                    await prisma.like.create({
                        data: {
                            user_id: socket.userId,
                            post_id: postId
                        }
                    });
                    isLiked = true;
                }
                // Get updated like count
                const likesCount = await prisma.like.count({
                    where: { post_id: postId }
                });
                // Broadcast like update to all users in social feed
                io.to('social:feed').emit('social:post-liked', {
                    postId,
                    likesCount,
                    isLiked,
                    user_id: socket.userId
                });
            }
            catch (error) {
                console.error('Social like error:', error);
                socket.emit('social:error', { error: 'Failed to like post' });
            }
        });
        // Leaderboard handlers
        socket.on('leaderboard:join', (data) => {
            const { period } = data; // 'week', 'month', 'all'
            socket.join(`leaderboard:${period}`);
        });
        socket.on('leaderboard:leave', (data) => {
            const { period } = data;
            socket.leave(`leaderboard:${period}`);
        });
        // Notification handlers
        socket.on('notifications:join', () => {
            socket.join(`notifications:${socket.userId}`);
        });
        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`User ${socket.username} disconnected`);
        });
    });
    // Periodic leaderboard updates
    setInterval(async () => {
        try {
            // Update weekly leaderboard
            const weeklyLeaderboard = await prisma.user.findMany({
                where: {
                    meditation_sessions: {
                        some: {
                            completed_at: {
                                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                            }
                        }
                    }
                },
                select: {
                    id: true,
                    username: true,
                    avatar_url: true,
                    meditation_sessions: {
                        where: {
                            completed_at: {
                                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                            }
                        },
                        select: {
                            duration_minutes: true
                        }
                    }
                },
                take: 10
            });
            const weeklyProcessed = weeklyLeaderboard.map((user) => ({
                id: user.id,
                username: user.username,
                avatar_url: user.avatar_url,
                totalTime: user.meditation_sessions.reduce((sum, session) => sum + session.duration_minutes, 0),
                sessionCount: user.meditation_sessions.length
            })).sort((a, b) => b.totalTime - a.totalTime);
            io.to('leaderboard:week').emit('leaderboard:weekly-update', weeklyProcessed);
        }
        catch (error) {
            console.error('Leaderboard update error:', error);
        }
    }, 60000); // Update every minute
};
exports.setupSocketHandlers = setupSocketHandlers;
exports.default = exports.setupSocketHandlers;
//# sourceMappingURL=socketHandlers.js.map