/**
 * Mock Meditation Session Service - Frontend Only
 */

import type {
  MeditationSession,
  MeditationSettings,
  ApiResponse,
  MeditationType,
} from "../types";

class MockMeditationSessionService {
  private sessions: Map<string, MeditationSession> = new Map();
  private currentSessionId: string | null = null;

  async startSession(type: MeditationType, duration: number): Promise<ApiResponse<{ sessionId: string }>> {
    try {
      const sessionId = "session_" + Date.now();
      const userId = localStorage.getItem("currentUserId") || "demo1";
      
      const settings: MeditationSettings = {
        userId,
        type,
        duration,
        soundscape: {
          enabled: true,
          type: "ocean",
          volume: 0.5
        },
        binauralBeats: {
          enabled: false,
          frequency: 40,
          volume: 0.3
        },
        guidedVoice: {
          enabled: true,
          voice: "female",
          language: "en",
          volume: 0.7
        },
        breathingPattern: {
          enabled: true,
          inhale: 4,
          hold: 4,
          exhale: 6,
          pause: 2
        }
      };

      const session: MeditationSession = {
        id: sessionId,
        userId,
        type,
        duration,
        settings,
        state: "preparing",
        startedAt: new Date(),
        progress: {
          currentTime: 0,
          totalTime: duration * 60,
          percentage: 0,
          phase: "preparation"
        },
        analytics: {
          heartRateVariability: [],
          stressLevel: 0,
          focusScore: 0,
          calmScore: 0,
          sessionQuality: 0
        }
      };

      this.sessions.set(sessionId, session);
      this.currentSessionId = sessionId;

      return {
        success: true,
        data: { sessionId }
      };
    } catch {
      return {
        success: false,
        error: "Failed to start session"
      };
    }
  }

  async pauseSession(sessionId: string): Promise<ApiResponse<void>> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        return {
          success: false,
          error: "Session not found"
        };
      }

      session.state = "paused";
      this.sessions.set(sessionId, session);

      return {
        success: true,
        data: undefined
      };
    } catch {
      return {
        success: false,
        error: "Failed to pause session"
      };
    }
  }

  async completeSession(sessionId: string): Promise<ApiResponse<MeditationSession>> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        return {
          success: false,
          error: "Session not found"
        };
      }

      const completedSession: MeditationSession = {
        ...session,
        state: "completed",
        endedAt: new Date(),
        progress: {
          ...session.progress,
          currentTime: session.duration * 60,
          percentage: 100,
          phase: "completion"
        }
      };

      this.sessions.set(sessionId, completedSession);
      this.currentSessionId = null;

      // Update user's total meditation time
      const userId = localStorage.getItem("currentUserId");
      if (userId) {
        const currentMinutes = parseInt(localStorage.getItem("totalMeditationMinutes") || "0");
        const newMinutes = currentMinutes + session.duration;
        localStorage.setItem("totalMeditationMinutes", newMinutes.toString());
      }

      return {
        success: true,
        data: completedSession
      };
    } catch {
      return {
        success: false,
        error: "Failed to complete session"
      };
    }
  }

  async getUserSessions(userId: string): Promise<ApiResponse<MeditationSession[]>> {
    try {
      const userSessions = Array.from(this.sessions.values())
        .filter(session => session.userId === userId)
        .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

      return {
        success: true,
        data: userSessions
      };
    } catch {
      return {
        success: false,
        error: "Failed to get user sessions"
      };
    }
  }

  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  async getSession(sessionId: string): Promise<ApiResponse<MeditationSession>> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        return {
          success: false,
          error: "Session not found"
        };
      }

      return {
        success: true,
        data: session
      };
    } catch {
      return {
        success: false,
        error: "Failed to get session"
      };
    }
  }
}

export const meditationSessionService = new MockMeditationSessionService();
