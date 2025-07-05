/**
 * Socket.io Server for Real-time Features
 * Handles real-time meditation sessions, notifications, and social interactions
 */

import { createServer } from "http";
import { Server, Socket } from "socket.io";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Types for socket events
interface SocketUser {
  id: string;
  email: string;
  username: string | null;
}

interface PostData {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

interface CommentData {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

interface AuthenticatedSocket extends Socket {
  user?: SocketUser;
}

// Authentication middleware for socket connections
io.use(async (socket: AuthenticatedSocket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret",
    ) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true },
    });

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    next(new Error("Authentication error"));
  }
});

// Connection handling
io.on("connection", (socket: AuthenticatedSocket) => {
  console.log(`User ${socket.user?.username} connected`);

  // Join user to their personal room
  if (socket.user) {
    socket.join(`user:${socket.user.id}`);
  }

  // Meditation Session Events
  socket.on("join-meditation-session", async (sessionId: string) => {
    try {
      // Verify user has access to this session
      const session = await prisma.meditationSession.findFirst({
        where: {
          id: sessionId,
          user_id: socket.user?.id,
        },
      });

      if (session) {
        socket.join(`meditation:${sessionId}`);

        // Notify others in group sessions
        socket.to(`meditation:${sessionId}`).emit("user-joined-session", {
          userId: socket.user?.id,
          username: socket.user?.username,
        });
      }
    } catch (err) {
      console.error("Failed to join meditation session:", err);
      socket.emit("error", { message: "Failed to join meditation session" });
    }
  });

  socket.on("leave-meditation-session", (sessionId: string) => {
    socket.leave(`meditation:${sessionId}`);
    socket.to(`meditation:${sessionId}`).emit("user-left-session", {
      userId: socket.user?.id,
      username: socket.user?.username,
    });
  });

  socket.on(
    "meditation-progress",
    (data: { sessionId: string; progress: number; timeElapsed: number }) => {
      // Broadcast progress to other participants in group sessions
      socket.to(`meditation:${data.sessionId}`).emit("participant-progress", {
        userId: socket.user?.id,
        username: socket.user?.username,
        progress: data.progress,
        timeElapsed: data.timeElapsed,
      });
    },
  );

  socket.on(
    "meditation-milestone",
    async (data: {
      sessionId: string;
      milestone: string;
      timeElapsed: number;
    }) => {
      try {
        // TODO: Add MeditationMilestone model to Prisma schema
        // For now, just broadcast the milestone without saving to DB
        console.log(`Milestone achieved: ${data.milestone} at ${data.timeElapsed}s for session ${data.sessionId}`);

        // Broadcast milestone to other participants
        socket
          .to(`meditation:${data.sessionId}`)
          .emit("participant-milestone", {
            userId: socket.user?.id,
            username: socket.user?.username,
            milestone: data.milestone,
            timeElapsed: data.timeElapsed,
          });
      } catch (error) {
        console.error("Error saving meditation milestone:", error);
      }
    },
  );

  // Social Feed Events
  socket.on("new-post", (post: PostData) => {
    // Broadcast new post to followers
    socket.broadcast.emit("post-created", {
      post,
      authorId: socket.user?.id,
      authorUsername: socket.user?.username,
    });
  });

  socket.on("post-liked", (data: { postId: string; authorId: string }) => {
    // Notify post author
    io.to(`user:${data.authorId}`).emit("post-liked", {
      postId: data.postId,
      likedBy: socket.user?.username,
      userId: socket.user?.id,
    });
  });

  socket.on(
    "new-comment",
    (data: { postId: string; comment: CommentData; authorId: string }) => {
      // Notify post author
      io.to(`user:${data.authorId}`).emit("new-comment", {
        postId: data.postId,
        comment: data.comment,
        commentBy: socket.user?.username,
        userId: socket.user?.id,
      });
    },
  );

  socket.on("new-follower", (data: { followedUserId: string }) => {
    // Notify the followed user
    io.to(`user:${data.followedUserId}`).emit("new-follower", {
      followerId: socket.user?.id,
      followerUsername: socket.user?.username,
    });
  });

  // Achievement Events
  socket.on(
    "achievement-unlocked",
    async (data: { achievementId: string; type: string }) => {
      try {
        // Save achievement to database
        await prisma.userAchievement.create({
          data: {
            user_id: socket.user!.id,
            achievement_id: data.achievementId,
            earned_at: new Date(),
          },
        });

        // Broadcast achievement to friends/followers
        socket.broadcast.emit("friend-achievement", {
          userId: socket.user?.id,
          username: socket.user?.username,
          achievementId: data.achievementId,
          type: data.type,
        });
      } catch (error) {
        console.error("Error saving achievement:", error);
      }
    },
  );

  // QR Code Events
  socket.on(
    "qr-scan-success",
    async (data: { qrCodeId: string; location?: string }) => {
      try {
        // TODO: Add QRScan model to Prisma schema
        // For now, just log the scan and emit success
        console.log(`QR scan: ${data.qrCodeId} by user ${socket.user?.id} at ${data.location || 'unknown location'}`);

        // Emit scan success back to user
        socket.emit("qr-scan-recorded", {
          qrCodeId: data.qrCodeId,
          timestamp: new Date(),
        });
      } catch (err) {
        console.error("Failed to record QR scan:", err);
        socket.emit("error", { message: "Failed to record QR scan" });
      }
    },
  );

  // Leaderboard Events
  socket.on("request-leaderboard-update", () => {
    // This would typically fetch fresh leaderboard data
    // For now, we'll emit a placeholder
    socket.emit("leaderboard-updated", {
      timestamp: new Date(),
      message: "Leaderboard data refreshed",
    });
  });

  // 🏆 REAL-TIME LEADERBOARD EVENTS (MAIN FEATURE)
  socket.on("request-leaderboard", async () => {
    try {
      const leaderboard = await getTopUsers();
      socket.emit("leaderboard-update", leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  });

  socket.on("meditation-completed", async (data: { 
    duration: number; 
    points: number; 
    sessionType: string;
  }) => {
    try {
      if (!socket.user) return;

      // Update user's total meditation time and trigger leaderboard refresh
      await prisma.user.update({
        where: { id: socket.user.id },
        data: { 
          total_meditation_minutes: {
            increment: Math.floor(data.duration / 60)
          }
        }
      });

      // Get updated leaderboard
      const leaderboard = await getTopUsers();
      
      // Broadcast to ALL users for real-time competition
      io.emit("leaderboard-update", leaderboard);
      
      // Notify specific achievements
      io.emit("user-achievement", {
        userId: socket.user.id,
        username: socket.user.username,
        points: data.points,
        sessionType: data.sessionType,
        duration: data.duration
      });

      console.log(`LEADERBOARD: ${socket.user.username} completed ${data.sessionType} for ${data.duration}s - UPDATED`);
    } catch (error) {
      console.error("Error updating meditation completion:", error);
    }
  });

  // 📱 QR CODE SCANNING EVENTS (REAL-TIME FRIEND CONNECTIONS)
  socket.on("qr-scanned", async (data: { scannedQrCode: string }) => {
    try {
      if (!socket.user) return;

      // Find the user being scanned
      const targetUser = await prisma.user.findUnique({
        where: { qr_code: data.scannedQrCode },
        select: { id: true, username: true, qr_code: true }
      });

      if (!targetUser) {
        socket.emit("qr-scan-error", { message: "User not found" });
        return;
      }

      if (targetUser.id === socket.user.id) {
        socket.emit("qr-scan-error", { message: "Cannot scan your own QR code" });
        return;
      }

      // Create friendship/connection
      await prisma.userRelationship.create({
        data: {
          follower_id: socket.user.id,
          following_id: targetUser.id
        }
      });

      // Notify both users in real-time
      socket.emit("qr-scan-success", {
        message: `Connected with ${targetUser.username}!`,
        newFriend: {
          id: targetUser.id,
          username: targetUser.username
        }
      });

      io.to(`user:${targetUser.id}`).emit("new-connection", {
        message: `${socket.user.username} connected with you via QR!`,
        newFollower: {
          id: socket.user.id,
          username: socket.user.username
        }
      });

      console.log(`QR CONNECTION: ${socket.user.username} → ${targetUser.username}`);
    } catch (error) {
      console.error("Error processing QR scan:", error);
      socket.emit("qr-scan-error", { message: "Connection failed" });
    }
  });

  // Disconnect handling
  socket.on("disconnect", () => {
    console.log(`User ${socket.user?.username} disconnected`);
  });
});

// Helper function to get top users for leaderboard
async function getTopUsers() {
  const topUsers = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      total_meditation_minutes: true,
      avatar_url: true
    },
    orderBy: {
      total_meditation_minutes: 'desc'
    },
    take: 50, // Top 50 users
    where: {
      is_public: true // Only show public profiles
    }
  });

  return topUsers.map((user, index) => ({
    rank: index + 1,
    id: user.id,
    username: user.username || 'Anonymous',
    totalMinutes: user.total_meditation_minutes,
    avatar: user.avatar_url
  }));
}

// REST API endpoints for socket server status
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    connections: io.engine.clientsCount,
    timestamp: new Date(),
  });
});

app.get("/stats", (req, res) => {
  res.json({
    connectedClients: io.engine.clientsCount,
    rooms: Array.from(io.sockets.adapter.rooms.keys()),
    timestamp: new Date(),
  });
});

// Error handling
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await prisma.$disconnect();
  server.close(() => {
    console.log("Socket server closed");
    process.exit(0);
  });
});

const PORT = process.env.SOCKET_PORT || 3002;

server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});

export { io, server };
