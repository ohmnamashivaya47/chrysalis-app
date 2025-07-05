/**
 * Socket.io Client Service
 * Handles real-time communication with the socket server
 */

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import type { Post, Comment } from "../types";

interface VitalsData {
  heartRate?: number;
  breathingRate?: number;
  stressLevel?: number;
}

interface SocketEvents {
  // Authentication
  connect: () => void;
  disconnect: () => void;
  error: (error: { message: string }) => void;

  // Meditation Sessions
  "user-joined-session": (data: { userId: string; username: string }) => void;
  "user-left-session": (data: { userId: string; username: string }) => void;
  "participant-progress": (data: {
    userId: string;
    username: string;
    progress: number;
    timeElapsed: number;
  }) => void;
  "participant-milestone": (data: {
    userId: string;
    username: string;
    milestone: string;
    timeElapsed: number;
  }) => void;
  "meditation-chat-message": (data: {
    userId: string;
    username: string;
    message: string;
    timestamp: Date;
  }) => void;
  "participant-vitals": (data: {
    userId: string;
    username: string;
    vitals: VitalsData;
    timestamp: Date;
  }) => void;

  // Social Feed
  "post-created": (data: {
    post: Post;
    authorId: string;
    authorUsername: string;
  }) => void;
  "post-liked": (data: {
    postId: string;
    likedBy: string;
    userId: string;
  }) => void;
  "new-comment": (data: {
    postId: string;
    comment: Comment;
    commentBy: string;
    userId: string;
  }) => void;
  "new-follower": (data: {
    followerId: string;
    followerUsername: string;
  }) => void;

  // Achievements
  "friend-achievement": (data: {
    userId: string;
    username: string;
    achievementId: string;
    type: string;
  }) => void;

  // QR Codes
  "qr-scan-recorded": (data: { qrCodeId: string; timestamp: Date }) => void;

  // Leaderboard
  "leaderboard-updated": (data: { timestamp: Date; message: string }) => void;
}

type EventCallback = (...args: unknown[]) => void;

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private eventListeners = new Map<string, Set<EventCallback>>();

  // Connection Management
  public connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3002",
      {
        auth: { token },
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: this.maxReconnectAttempts,
        transports: ["websocket", "polling"],
      },
    );

    this.setupEventHandlers();
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  public get isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Event Subscription
  public on<K extends keyof SocketEvents>(
    event: K,
    callback: SocketEvents[K],
  ): () => void {
    const eventCallback = callback as EventCallback;

    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }

    this.eventListeners.get(event)!.add(eventCallback);

    if (this.socket) {
      this.socket.on(event as string, eventCallback);
    }

    // Return unsubscribe function
    return () => {
      this.eventListeners.get(event)?.delete(eventCallback);
      if (this.socket) {
        this.socket.off(event as string, eventCallback);
      }
    };
  }

  public emit(event: string, data?: unknown): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("Socket not connected, cannot emit event:", event);
    }
  }

  // Meditation Session Events
  public joinMeditationSession(sessionId: string): void {
    this.emit("join-meditation-session", sessionId);
  }

  public leaveMeditationSession(sessionId: string): void {
    this.emit("leave-meditation-session", sessionId);
  }

  public sendMeditationProgress(
    sessionId: string,
    progress: number,
    timeElapsed: number,
  ): void {
    this.emit("meditation-progress", { sessionId, progress, timeElapsed });
  }

  public sendMeditationMilestone(
    sessionId: string,
    milestone: string,
    timeElapsed: number,
  ): void {
    this.emit("meditation-milestone", { sessionId, milestone, timeElapsed });
  }

  public sendMeditationChatMessage(sessionId: string, message: string): void {
    this.emit("meditation-chat-message", { sessionId, message });
  }

  public sendMeditationHeartbeat(sessionId: string, vitals?: VitalsData): void {
    this.emit("meditation-heartbeat", { sessionId, vitals });
  }

  // Social Feed Events
  public notifyNewPost(post: Post): void {
    this.emit("new-post", post);
  }

  public notifyPostLiked(postId: string, authorId: string): void {
    this.emit("post-liked", { postId, authorId });
  }

  public notifyNewComment(
    postId: string,
    comment: Comment,
    authorId: string,
  ): void {
    this.emit("new-comment", { postId, comment, authorId });
  }

  public notifyNewFollower(followedUserId: string): void {
    this.emit("new-follower", { followedUserId });
  }

  // Achievement Events
  public notifyAchievementUnlocked(achievementId: string, type: string): void {
    this.emit("achievement-unlocked", { achievementId, type });
  }

  // QR Code Events
  public notifyQRScanSuccess(qrCodeId: string, location?: string): void {
    this.emit("qr-scan-success", { qrCodeId, location });
  }

  // Leaderboard Events
  public requestLeaderboardUpdate(): void {
    this.emit("request-leaderboard-update");
  }

  // Private Methods
  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
      this.reconnectAttempts = 0;
      this.resubscribeToEvents();
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from socket server:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("Max reconnection attempts reached");
      }
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  private resubscribeToEvents(): void {
    if (!this.socket) return;

    // Re-register all event listeners after reconnection
    this.eventListeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket!.on(event, callback);
      });
    });
  }

  // Helper method to create typed event listeners
  public createEventListener<T>(
    event: string,
    handler: (data: T) => void,
  ): () => void {
    const listener = (data: T) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error handling socket event ${event}:`, error);
      }
    };

    return this.on(event as keyof SocketEvents, listener as EventCallback);
  }
}

// Singleton instance
export const socketService = new SocketService();

// Convenience hooks for React components
export const useSocketEvent = <T>(
  event: string,
  handler: (data: T) => void,
) => {
  useEffect(() => {
    const unsubscribe = socketService.createEventListener(event, handler);
    return unsubscribe;
  }, [event, handler]);
};

export const useSocketConnection = (token?: string) => {
  useEffect(() => {
    if (token) {
      socketService.connect(token);
    }

    return () => {
      if (!token) {
        socketService.disconnect();
      }
    };
  }, [token]);

  return {
    isConnected: socketService.isConnected,
    connect: socketService.connect.bind(socketService),
    disconnect: socketService.disconnect.bind(socketService),
  };
};
